const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt =require('jsonwebtoken');


const { connectDB } = require('./config/database');
const { User } = require('./models/user');
const { signUpValidator } = require('./utils/validator');
const { userAuth } = require('./middlewares/auth');

const app = express();

// thios is the middleware prodided by express to convert json into JS object
app.use(express.json());
// use to parse the cookie else give undefined
app.use(cookieParser());

// POST for signup
app.post('/signup', async (req, res) => {

  try {
    // add a signup validator fnuction before saving
    const { firstName, lastName, emailId, password } = req?.body
    signUpValidator(req);
  
    // create a hash for the pwd before saving
    const hashPassword = await bcrypt.hash(password, 10)
  
    // creating the new instance of the User Modal
    const user = new User({
      firstName, lastName, emailId, password: hashPassword
    });

    await user.save();
    res.send('user save in DB ')
    console.log('User saved sucessfully');
  }
  catch (err) {
    res.send('error occured in signup: ' + err.message)
  }
})

// POST for login
app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if(!user) {
      throw new Error('invalid email / password');
    }
    const isValid = await bcrypt.compare(password, user.password);

    if(isValid) {
      const token = jwt.sign({_id: user?._id}, 'Abhishek', {expiresIn: '0d'})

      res.cookie('token', token, { expires: new Date(Date.now() + 900000)})
      res.send('success is successful');
    } else {
      throw new Error('invalid email / password');
    }
  } 
  catch (err) {
    res.send('error occured in signup: ' + err.message)
  }
})

// GET profile 
app.get('/profile', userAuth, async (req, res) => {
  try{
    res.send(req.user);
  }
  catch (err) {
    res.send('error occured getting profile: ' + err.message)
  }
})

// POST connectRequest 
app.post('/sendConnectionRequest', userAuth, async (req, res) => {
  try{
    // res.send(req.user);
    res.send(req?.user?.firstName + ' has send the connection request');
  }
  catch (err) {
    res.send('error occured getting profile: ' + err.message)
  }
})

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


