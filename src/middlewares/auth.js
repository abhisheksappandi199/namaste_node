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

const userAuth = (req, res, next) => {
  console.log('inside the user middleware');
  const token = 'xyz'
  const isAuthorised = token === 'xyz'
  if(!isAuthorised) {
    res.send('Invalid authorization')
  } else {
    next()
  }
}


module.exports = {
  adminAuth,
  userAuth
}