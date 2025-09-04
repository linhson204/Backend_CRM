const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

// Define the Picture schema
const mediaSchema = new Schema({
  link: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  savedName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  userChatId: {
    type: String,
  },
});

mediaSchema.plugin(toJSON);
mediaSchema.plugin(paginate);

// Create the Media model
const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
