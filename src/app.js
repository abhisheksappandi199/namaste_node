const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./config/database');
const { User } = require('./models/user');
const { signUpValidator } = require('./utils/validator');
const { userAuth } = require('./middlewares/auth');

const app = express();

// this is the middleware prodided by express to convert json into JS object
app.use(express.json());
// use to parse the cookie else give undefined
app.use(cookieParser());


const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request');
const { UserRouter } = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', UserRouter);

// GET user by FirstName
app.get('/user', async (req, res) => {
  try {
    const user = await User.findOne({firstName: req.body.firstName});
    if(!user) {
      res.status(404).send('user not found')
    } else {
      res.send(user)
    }
  } catch (err) {
    res.status(404).send('something went wromg')
  }
})

connectDB()
  .then(() => {
    console.log('DB connect sucessfully..!');
    app.listen(4000, () => {
      console.log('server is listerning on port 4000');
    });
  })
  .catch(err => {
  console.log("🚀 ~ failed to connect to DB",err);
  })


