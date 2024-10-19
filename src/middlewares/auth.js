const { User } = require('../models/user');
const jwt =require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  console.log('inside the admin middleware');
  const token = 'xyz'
  const isAuthorised = token === 'xyz'
  if(!isAuthorised) {
    res.send('Invalid authorization')
  } else {
    next()
  }
}

const userAuth = async (req, res, next) => {
  try {
    const {token} = req.cookies;
    const isTokenValid = await jwt.verify(token, 'Abhishek');
  
    if(!isTokenValid) {
      throw new Error('Invalid authorization');
    }
    const user = await User.findOne({_id: isTokenValid?._id})
  
    if(!user) {
      throw new Error('user not found');
    }
    req.user = user;
    next()
  }
  catch (err) {
    res.send('error occured getting profile: ' + err.message)
  }
}


module.exports = {
  adminAuth,
  userAuth
}