const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["ignored", "intrested", "accepted", "rejected"],
      message: '{VALUES} is incorrect or invalid status type'
    }
  }
},
{ timestamps: true })

connectionRequestSchema.pre('save', function(next) {
  const connectionRequest = this;
  // check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error('cannot send request to yourself');
  }
  next();
})

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = {
  ConnectionRequest
};