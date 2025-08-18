const mongoose = require('mongoose');

const { Schema } = mongoose;
const { paginate } = require('../plugins');

const attachmentsSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['image', 'video'],
    },
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const postGroupSchema = new Schema({
  userId: {
    type: String,
    require: true,
  },
  facebookId: {
    type: String,
    require: true,
  },
  groupFbId: {
    type: String,
    require: true,
  },
  userNameFacebook: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    required: true,
  },
  attachments: [attachmentsSchema],
  facebookPostId: {
    type: String, // ID bài viết sau khi đăng lên FB
  },
  isPosted: {
    type: Boolean,
  },
  facebookPostUrl: {
    type: String, // Link bài viết
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

postGroupSchema.plugin(paginate);
const PostGroup = mongoose.model('PostGroup', postGroupSchema);

module.exports = PostGroup;
