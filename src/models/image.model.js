const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const { Schema } = mongoose;

// Define the Picture schema
const imageSchema = new Schema({
  link: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

imageSchema.plugin(toJSON);

// Create the Image model
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
