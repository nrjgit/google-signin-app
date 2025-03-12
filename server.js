const express = require('express');
const mongoose = require('mongoose'); 

require('dotenv').config()
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.Promise = Promise; 

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('Server is running');
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(function (req, res, next) {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Or use 'same-origin-allow-popups' if you need to allow popups
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Ensure embedded content is from a trusted origin

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);


const https = require('https');
const querystring = require('querystring');

app.post('/send-text', (req, res) => {
  const { phoneNumber, name, address1 } = req.body;

  const postData = querystring.stringify({
    To: `+91${phoneNumber}`,
    From: `+1${fromNumber}`,
    Body: `Your parking Spot: ${name}, available at ${address1}`,
  });

  const options = {
    hostname: process.env.TWILIO_HOSTNAME,
    path: process.env.TWILIO_PATH,
    method: 'POST',
    auth: `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  };

  const twilioReq = https.request(options, (twilioRes) => {
    twilioRes.on('data', (d) => res.send({ ok: true, response: JSON.parse(d) }));
  });

  twilioReq.on('error', () => res.status(500).send({ error: 'Failed to send SMS' }));
  twilioReq.write(postData);
  twilioReq.end();
});

app.use(express.static(path.join(__dirname, "build")));


console.log(app._router.stack.map(layer => layer.route && layer.route.path).filter(Boolean));

module.exports = app;

