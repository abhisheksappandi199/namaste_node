const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlenght: 1,
    maxlength: 50,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 10
  },
  gender: {
    type: String,
    validate(value) {
      if(!['male', 'female', 'other'].includes(value)) {
        throw new Error("gender data is invalid"); 
      }
    }
  },
   photoUrl: {
    type: String,
    default: 'https://www.pngfind.com/mpng/TRJxwTh_default-profile-picture-transparent-hd-png-download/'
   },
   about: {
    type: String,
    default: 'Hi looking for a perfect match'
   },
   skills: {
    type: [String],
   }
}, 
{
  timestamps: true,
})

const User = mongoose.model('User', userSchema);

module.exports = {
  User
};