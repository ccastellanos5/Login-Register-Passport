const mongoose = require('mongoose');
const CardSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId, 
    ref: "User"
  } 
});

const Card = mongoose.model('Card', CardSchema);
module.exports = Card;