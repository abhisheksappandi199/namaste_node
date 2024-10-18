const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt =require('jsonwebtoken');


const { connectDB } = require('./config/database');
const { User } = require('./models/user');
const { signUpValidator } = require('./utils/validator');

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
      const token = jwt.sign({_id: user?._id}, 'Abhishek')

      res.cookie('token', token)
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
app.get('/profile', async (req, res) => {
  try{
    const token = req.cookies.token;
    console.log("🚀 ~ app.get ~ token:", token)
    const isTokenValid = jwt.verify(token, 'Abhishek');
    console.log("🚀 ~ app.get ~ isTokenValid:", isTokenValid)
    if(!isTokenValid) {
      throw new Error('Invalid token');
    }
    const user = await User.findOne({_id: isTokenValid?._id})

    if(!user) {
      throw new Error('User not found');
    }

    res.send(user);
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

// GET Feed api - get all useers fron DB
app.get('/feed', async (req, res) => {
  try {
    const user = await User.find();
    if(!user) {
      res.status(404).send('user not found')
    } else {
      res.send(user)
    }
  } catch (err) {
    res.status(404).send('something went wromg')
  }
})

// DELETE user based on id
app.delete('/user', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId);
    if(!user) {
      res.status(404).send('user not found')
    } else {
      res.send('deleted sucessfully')
    }
  }
  catch (err) {
    res.status(404).send('error occured!');
  }
})

// patch the user based on id
app.patch('/user/:userId', async (req, res) => {
  const user = req.params?.userId
  const userData = req.body

  try {
    const editableItems = ["age", "photoUrl","skills", "about"]
    const isEditable = Object.keys(editableItems).every(item => editableItems?.includes(item))
    if(!isEditable) {
      throw new Error("the field is not editable");
    }

    const updatedUser = await User.findByIdAndUpdate({_id: user}, userData, {runValidators: true})
    if(!updatedUser) {
      res.send(404).send('user not found')
    } else {
      res.send('updated sucessfully')
    }
  } 
  catch (err) { 
    res.status(500).send('error occured: ' + err.message)
  }
})

// used for err handling for the whole application
app.use('/', (err, req, res, next) => {
    res.status(500).send("something went wrong");
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


