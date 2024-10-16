const express = require('express');
const { connectDB } = require('./config/database');
const app = express();

connectDB()
  .then(() => {
    console.log('DB connect sucessfully..!');
    app.listen(4000, () => {
      console.log('server is listerning on port 4000');
    });
  })
  .catch(err => {
  console.log("🚀 ~ failed to connect to DB");
  })


