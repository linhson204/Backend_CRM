const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const commentService = require('../../services/dang_bai_tcn/commentFb.service');
const websocketService = require('../../services/websocket.service');

const createComment = catchAsync(async (req, res) => {
  const comment = await commentService.createComment(req.body);

  // Gửi thông báo WebSocket khi tạo comment mới
  websocketService.notifyNewComment(comment);

  res.status(httpStatus.CREATED).send(comment);
});

const getCommentById = catchAsync(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  res.status(httpStatus.OK).send(comment);
});

const getCommentsByPostId = catchAsync(async (req, res) => {
  const { postId, userId, facebookId } = req.body;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await commentService.getCommentsByPostId(
    {
      postId,
      userId,
      facebookId,
    },
    options
  );

  res.status(httpStatus.OK).send(result);
});

const updateCommentById = catchAsync(async (req, res) => {
  const comment = await commentService.updateCommentById(req.params.commentId, req.body);
  res.status(httpStatus.OK).send(comment);
});

const deleteCommentById = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addFeedbackToComment = catchAsync(async (req, res) => {
  const comment = await commentService.addFeedbackToComment(req.params.commentId, req.body);
  console.log(comment);
  res.status(httpStatus.OK).send(comment);
});

const updateFeedbackInComment = catchAsync(async (req, res) => {
  const { commentId, feedbackId } = req.params;
  const feedbackBody = req.body;

  const updatedComment = await commentService.updateFeedbackInComment(commentId, feedbackId, feedbackBody);
  res.status(httpStatus.OK).send(updatedComment);
});

const deleteFeedbackFromComment = catchAsync(async (req, res) => {
  const comment = await commentService.deleteFeedbackFromComment(req.params.commentId, req.params.feedbackId);
  res.status(httpStatus.OK).send(comment);
});

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
