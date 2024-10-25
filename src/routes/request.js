const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require('../models/connectionRequest');
const { User } = require('../models/user');
const requestRouter = express.Router();

// POST connectionRequest 
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "intrested"];
    if(!allowedStatus.includes(status)) {
      throw new Error(`Invalid status`);
    }

    const toUser = await User.findOne({ _id: toUserId })
    if(!toUser) {
      throw new Error(`User not found`);
    }

    const exsistingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (exsistingConnectionRequest) {
      throw new Error('Connect request is already exsist')
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId, toUserId, status
    })

    const data = await connectionRequest.save();

    res.json({
      message: `${fromUserId} is ${status} in ${toUserId}`,
      data: data
    })
  }
  catch (err) {
    res.send('error occured getting profile: ' + err.message)
  }
})

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ['accepted', 'rejected'];
    if(!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const connectionRequest = await ConnectionRequest.findOne({ 
      _id: requestId,
      toUserId: loggedInUser._id,
      status: 'intrested'
    })

    if (!connectionRequest) {
      return res.status(404).json({ message: 'connection request not found' });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({ message: 'connection request ' + status , data});
  }
  catch (err) {
    res.send('error occured getting profile: ' + err.message)
  }
})

module.exports = {
  requestRouter
}