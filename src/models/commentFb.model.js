const mongoose = require('mongoose');

const { Schema } = mongoose;
const { paginate } = require('./plugins');

const feedbackSchema = new Schema({
  content: {
    type: String,
    require: true,
  },
  userNameFacebook: {
    type: String,
    require: true,
  },
  userLinkFb: {
    type: String,
  },
  replyToAuthor: {
    type: String,
    required: true,
  },
  id_facebookReply: {
    type: String,
  },
  facebookReplyUrl: {
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

const commentSchema = new Schema({
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userId: {
    type: String,
    require: true,
  },
  facebookId: {
    type: String,
    require: true,
  },
  postId: {
    type: String,
    required: true,
  },
  userLinkFb: {
    type: String,
  },
  userNameFacebook: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    required: true,
  },
  facebookCommentId: {
    type: String, // ID bài viết sau khi đăng lên FB
  },
  facebookCommentUrl: {
    type: String, // Link bài viết
  },

  listFeedback: [feedbackSchema],

  createdAt: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Number,
    required: true,
  },
});

commentSchema.plugin(paginate);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
