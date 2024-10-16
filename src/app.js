const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');

const app = express();

app.use('/admin', adminAuth)

app.get('/login', (req, res, next) => {
  res.send('login success');
});

app.get('/admin/getDetails', (req, res, next) => {
  res.send('all data sent')
});

app.get('/user/getDetails', userAuth, (req, res, next) => {
  res.send('all user data sent')
});

app.listen(4000, () => {
  console.log('server is listerning on port 4000');
});
