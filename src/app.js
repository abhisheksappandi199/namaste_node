const express = require('express');

const app = express();

app.use('/user',
  (req, res, next) => {
    console.log('response 1');
    // res.send('response 1');
    next();
})

app.use('/user',
  (req, res, next) => {
    console.log('response 2');
    res.send('response 2');
    // next();
})







// ----------------------------------------------------------------
// app.use('/user', ()=>{}, [()=>{},()=>{}], ()=>{},) // works with all array and independent

// app.use('/user',
//   (req, res, next) => {
//     console.log('response 1');
//     // res.send('response 1');
//     next();
// }, (req, res,next) => {
//   console.log('response 2');
//   // res.send('response 2');
//   next()
// },(req, res, next) => {
//   console.log('response 3');
//   // res.send('response 3');
//   next()
// },(req, res) => {
//   console.log('response 4');
//   res.send('response 4');
// })

app.listen(4000, () => {
  console.log('server is listerning on port 4000');
});

// app.get('/user', (req, res) => {
//   res.send({name: 'abhi', age: '27'})
// })

// app.post('/user', (req, res) => {
//   res.send('saved in the DB')
// })

// app.delete('/user', (req, res) => {
//   res.send('removed in the DB')
// })

// this will match all the HTTP methods API calls to /test
app.use("/test",(req, res) => {
  res.send('test from server')
})

console.log('hi there');
