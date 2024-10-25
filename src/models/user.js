const mongoose = require('mongoose');
const validator = require('validator');
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    index: true,
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
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error("Invalid email: " + value);
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if(!validator.isStrongPassword(value)) {
        throw new Error("Enter strong password: " + value);
      }
    }
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
    default: 'https://www.pngfind.com/mpng/TRJxwTh_default-profile-picture-transparent-hd-png-download/',
    validate(value) {
      if(!validator.isURL(value)) {
        throw new Error("Enter a valid url" + value);
      }
    }
   },
   about: {
    type: String,
    default: 'Hi looking for a perfect match'
   },
   skills: {
    type: [String],
    maxlength: 5,
   }
}, 
{
  timestamps: true,
})

userSchema.methods.getJWT = function () {
  const user = this;

  const token = jwt.sign({_id: user?._id}, 'Abhishek', {expiresIn: '7d'});

  return token;
}

userSchema.methods.validatePassword = async function(inputPassword) {
  const user = this;

  const hashPassword = user.password;

  const isPasswordValid = await bcrypt.compare(inputPassword, hashPassword);

  return isPasswordValid;
}

const User = mongoose.model('User', userSchema);

module.exports = {
  User
};