const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

// POST connectRequest 
requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
  try{
    // res.send(req.user);
    res.send(req?.user?.firstName + ' has send the connection request');
  }
  catch (err) {
    res.send('error occured getting profile: ' + err.message)
  }
})

module.exports = {
  requestRouter
}