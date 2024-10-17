const express = require('express');
const { connectDB } = require('./config/database');
const { User } = require('./models/user');
const req = require('express/lib/request');
const app = express();

// thios is the middleware prodided by express to convert json into JS object
app.use(express.json());

// POST for signup
app.post('/signup', async (req, res) => {
  // creating the new instance of the User Modal
  const user = new User(req.body);
  try {
    await user.save();
    res.send('user save in DB ')
    console.log('User saved sucessfully');
  }
  catch (err) {
    res.send('error occured')
  }
})


// GET user by FirstName
app.get('/user', async (req, res) => {
  try {
    const user = await User.findOne({firstName: req.body.firstName});
    if(!user) {
      res.status(404).send('user not found')
    } else {
      res.send(user)
    }
  } catch (err) {
    res.status(404).send('something went wromg')
  }
})

// GET Feed api - get all useers fron DB
app.get('/feed', async (req, res) => {
  try {
    const user = await User.find();
    if(!user) {
      res.status(404).send('user not found')
    } else {
      res.send(user)
    }
  } catch (err) {
    res.status(404).send('something went wromg')
  }
})

// DELETE user based on id
app.delete('/user', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId);
    if(!user) {
      res.send(404).send('user not found')
    } else {
      res.send('deleted sucessfully')
    }
  }
  catch (err) {
    res.status(404).send('error occured!');
  }
})

// patch the user based on id
app.patch('/user/:userId', async (req, res) => {
  const user = req.params?.userId
  const userData = req.body

  try {

    const editableItems = ["age", "photoUrl","skills", "about"]
    const isEditable = Object.keys(editableItems).every(item => editableItems?.includes(item))
    if(!isEditable) {
      throw new Error("the field is not editable");
    }

    const updatedUser = await User.findByIdAndUpdate({_id: user}, userData, {runValidators: true})
    if(!updatedUser) {
      res.send(404).send('user not found')
    } else {
      res.send('updated sucessfully')
    }
  } 
  catch (err) { 
    res.status(500).send('error occured: ' + err.message)
  }
})

// used for err handling for the whole application
app.use('/', (err, req, res, next) => {
    res.status(500).send("something went wrong");
})

connectDB()
  .then(() => {
    console.log('DB connect sucessfully..!');
    app.listen(4000, () => {
      console.log('server is listerning on port 4000');
    });
  })
  .catch(err => {
  console.log("🚀 ~ failed to connect to DB",err);
  })


