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

const postFbSchema = new Schema({
  userId: {
    type: String,
    require: true,
  },
  facebookId: {
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
  commentsCount: {
    type: Number,
    default: 0,
  },
});

postFbSchema.methods.addComment = async function () {
  this.commentsCount += 1;
  await this.save();
};

postFbSchema.methods.removeComment = async function () {
  this.commentsCount -= 1;
  await this.save();
};

postFbSchema.plugin(paginate);
const Post = mongoose.model('Post', postFbSchema);

module.exports = Post;
