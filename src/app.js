const express = require('express');
const { connectDB } = require('./config/database');
const { User } = require('./models/user');
const app = express();

// thios is the middleware prodided by express to convert json into JS object
app.use(express.json());

app.post('/signup', async (req, res) => {
  console.log("🚀 ~ app.post ~ req:", req.query)

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


