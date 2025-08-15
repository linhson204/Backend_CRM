const commentModel = require('../../models/dang_bai_tcn/commentFb.model');

const createComment = async (comment) => {
  return await commentModel.create(comment);
};

const getCommentById = async (commentId) => {
  return await commentModel.findOne({ facebookCommentId: commentId });
};

const getCommentsByPostId = async (filterData, options) => {
  const { postId, userId, facebookId } = filterData;

  // Tạo filter cho tìm kiếm
  const filter = {
    postId,
    userId,
    facebookId,
  };

  // Sử dụng paginate plugin để phân trang
  const comments = await commentModel.paginate(filter, options);

  return comments;
};

const updateCommentById = async (commentId, commentBody) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  Object.assign(comment, commentBody);
  return await comment.save();
};

const deleteCommentById = async (commentId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  await comment.remove();
};

const addFeedbackToComment = async (commentId, feedback) => {
  const comment = await getCommentById(commentId);
  console.log(comment);
  console.log('=============================');
  console.log(feedback);
  if (!comment) {
    throw new Error('Comment not found');
  }

  // Thêm feedback vào mảng listFeedback
  comment.listFeedback.push({
    ...feedback,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Lưu lại comment
  return await comment.save();
};

const updateFeedbackInComment = async (commentId, feedbackId, feedbackBody) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  const feedback = comment.listFeedback.find((fb) => fb._id.toString() === feedbackId);
  if (!feedback) {
    throw new Error('Feedback not found');
  }

  Object.assign(feedback, feedbackBody, { updatedAt: Date.now() });

  // Lưu lại comment
  return await comment.save();
};

const deleteFeedbackFromComment = async (commentId, feedbackId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  // Xóa feedback khỏi mảng listFeedback
  comment.listFeedback = comment.listFeedback.filter((fb) => fb._id.toString() !== feedbackId);

  // Lưu lại comment
  return await comment.save();
};

module.exports = {
  createComment,
  getCommentById,
  getCommentsByPostId,
  updateCommentById,
  deleteCommentById,
  addFeedbackToComment,
  updateFeedbackInComment,
  deleteFeedbackFromComment,
};
