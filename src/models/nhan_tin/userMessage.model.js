const mongoose = require('mongoose');

const { Schema } = mongoose;
const { paginate } = require('../plugins');

const userMessageSchema = new Schema({
  messageId: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
  facebookId: {
    type: String,
    require: true,
  },
  sender: {
    type: String,
    required: true,
  },
  lastMessage: {
    type: String,
  },
  createdAt: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Number,
    required: true,
  },
});

userMessageSchema.plugin(paginate);
const userMessage = mongoose.model('UserMessage', userMessageSchema);

module.exports = userMessage;
