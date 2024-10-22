const express = require('express');
const bcrypt = require('bcrypt');
const profileRouter = express.Router();
const { User } = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validator');

// GET profile 
profileRouter.get('/profile', userAuth, async (req, res) => {
  try{
    res.send(req.user);
  }
  catch (err) {
    res.send('error occured getting profile: ' + err.message)
  }
})

// PATCH profile edit
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try{
    if(!validateEditProfileData(req)) {
      throw new Error('invalid edit profile data')
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
    await loggedInUser.save();
    res.json({ message: `${loggedInUser.firstName}, your profile updated sucessfully`, data:  loggedInUser });
  }
  catch (err) {
    res.send('error occured getting profile: ' + err.message)
  }
})

// PATCH profile password
profileRouter.post('/profile/password', userAuth, async (req, res) => {
  try{
    if(!req.user.password) {
      throw new Error('please enter valid password')
    }
    const user = await User.findOne({ _id: req.user._id })

    if(!user) {
      throw new Error('user not found');
    }
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();
    res.send('password updated successfully');
  }
  catch (err) {
    res.send('error occured getting profile: ' + err.message)
  }
})


module.exports = {
  profileRouter
}