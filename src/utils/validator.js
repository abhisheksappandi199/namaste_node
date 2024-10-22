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

const validateEditProfileData = (req) => {
  const allowedFeilds = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills"
  ]

  const isEditAllowed = Object.keys(req.body).every(field => 
    allowedFeilds.includes(field)
  )

  return isEditAllowed;
}

module.exports = {
  signUpValidator,
  validateEditProfileData
}