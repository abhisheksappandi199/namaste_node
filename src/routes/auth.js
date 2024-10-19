const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { signUpValidator } = require('../utils/validator');

// POST for signup
authRouter.post('/signup', async (req, res) => {

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
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if(!user) {
      throw new Error('invalid email / password');
    }
    const isValid = await user.validatePassword(password);

    if(isValid) {
      const token = await user.getJWT();
      res.cookie('token', token, { expires: new Date(Date.now() + 900000)})
      res.send('success is successful');
    } else {
      throw new Error('invalid email / password');
    }
  } 
  catch (err) {
    res.send('error occured in login: ' + err.message)
  }
})

module.exports = {
  authRouter
}
