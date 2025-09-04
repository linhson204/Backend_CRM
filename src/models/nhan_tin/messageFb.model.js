const mongoose = require('mongoose');

const { Schema } = mongoose;
const { paginate } = require('../plugins');

const messageSchema = new Schema({
  userMessageId: {
    type: Schema.Types.ObjectId,
    ref: 'UserMessage',
    required: true,
  },
  fbName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    require: true,
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

messageSchema.plugin(paginate);
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
