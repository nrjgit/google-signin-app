const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path'); // ✅ Fix 1: path module required
const https = require('https');
const querystring = require('querystring');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ Fix 4: Middleware should come last
app.use(function (req, res, next) {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


mongoose.Promise = Promise; 

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('Server is running');
});

// ✅ Fix 2: API Routes should be before `express.static`

var fromNumber = process.env.TWILIO_PHONE_NUMBER;

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${port}`);
});

console.log(app._router.stack.map(layer => layer.route && layer.route.path).filter(Boolean));

module.exports = app;

