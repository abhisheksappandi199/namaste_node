const mongoose = require('mongoose');

const connectDB = async() => {
  await mongoose.connect('mongodb+srv://abhisheksappandi:OTIHMIybrF8NPRco@namstenode.7r58m.mongodb.net/devTinder')
}

module.exports = {
  connectDB
}
