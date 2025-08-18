const httpStatus = require('http-status');
const postGroupService = require('../../services/dang_bai_group/postGroup.service');
const websocketService = require('../../services/websocket.service');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const createPost = catchAsync(async (req, res) => {
  const post = await postGroupService.createPost(req.body);

  // Gửi thông báo WebSocket khi tạo post mới
  websocketService.notifyNewPost(post);

  res.status(httpStatus.CREATED).send(post);
});

const getPost = catchAsync(async (req, res) => {
  const post = await postGroupService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  res.send(post);
});

const getPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'createdAt', 'facebookId', 'groupFbId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Nếu không có sortBy trong query, mặc định sắp xếp theo createdAt desc (mới nhất trước)
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }

  const result = await postGroupService.queryPost(filter, options);
  res.send(result);
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postGroupService.updatePostById(req.params.postId, req.body);
  res.send(post);
});

const deletePost = catchAsync(async (req, res) => {
  await postGroupService.deletePost(req.params.postId);
  res.sendStatus(httpStatus.NO_CONTENT);
});

module.exports = {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
};
