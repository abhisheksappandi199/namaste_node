const express = require('express');
const UserRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require('../models/connectionRequest');

const USER_SAFE_DATA = "firstName LastName emal"

// GET all the penging connection request from the loggedIn user
UserRouter.get('/user/request/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log("🚀 ~ UserRouter.get ~ loggedInUser:", loggedInUser._id)

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'intrested'
    }).populate("fromUserId", USER_SAFE_DATA)
    // populate('fromUserId', ['FirstName', 'LastName'])

    res.json({ 
      message: 'Connection request was successful',
      data: connectionRequest
    })

  }
  catch (err) {
    res.status(404).send('ERROR : '+ err.message);
  }
})

UserRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ]
    })
    .populate('fromUserId', USER_SAFE_DATA)
    .populate('toUserId', USER_SAFE_DATA)

    const data = connectionRequest.map((row) => {
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
        return row.fromUserId;
    })

    res.json({ data })
  }
  catch (err) {
    res.status(404).send('ERROR : '+ err.message);
  }
})


module.exports = {
  UserRouter
}