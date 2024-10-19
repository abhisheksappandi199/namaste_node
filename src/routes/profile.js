const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');


// GET profile 
profileRouter.get('/profile', userAuth, async (req, res) => {
  try{
    res.send(req.user);
  }
  catch (err) {
    res.send('error occured getting profile: ' + err.message)
  }
})

module.exports = {
  profileRouter
}