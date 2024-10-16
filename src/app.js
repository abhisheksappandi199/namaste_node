const express = require('express');
const app = express();

app.use('/', (err,req, res, next) => {
  res.status(500).send('something went wrong')  
})

app.get('/userError', (req, res, next) => {
  try {

    throw new Error
  }
  catch (err) {
    res.send('error occured')
  }
});



app.listen(4000, () => {
  console.log('server is listerning on port 4000');
});
