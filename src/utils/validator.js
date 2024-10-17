const validator = require('validator');

const signUpValidator = (req) => {
  const { firstName, lastName, emailId, password } = req?.body

  if(!firstName || !lastName) {
    throw new Error('You must provide a first name and last name');
  } else if(!validator.isEmail(emailId)) {
    throw new Error('You must provide a valid email');
  } else if(!validator.isStrongPassword(password)) {
    throw new Error('You must provide a valid password');
  }
}

module.exports = {
  signUpValidator
}