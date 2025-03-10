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


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports = app;

