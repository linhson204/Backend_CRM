const httpStatus = require('http-status');
const userMessageService = require('../../services/nhan_tin/userMessage.service');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const createUserMessage = catchAsync(async (req, res) => {
  const userMessage = await userMessageService.createUserMessage(req.body);
  res.status(httpStatus.CREATED).send(userMessage);
});

const getUserMessage = catchAsync(async (req, res) => {
  const userMessage = await userMessageService.getUserMessageById(req.params.userMessageId);
  if (!userMessage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserMessage not found');
  }
  res.send(userMessage);
});

const getUserMessages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'createdAt', 'facebookId', 'messageId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Nếu không có sortBy trong query, mặc định sắp xếp theo createdAt desc (mới nhất trước)
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }

  if (!options.limit) {
    options.limit = '30';
  }

  const result = await userMessageService.queryUserMessage(filter, options);
  res.send(result);
});

const updateUserMessage = catchAsync(async (req, res) => {
  const userMessage = await userMessageService.updateUserMessageById(req.params.userMessageId, req.body);
  res.send(userMessage);
});

const deleteUserMessage = catchAsync(async (req, res) => {
  await userMessageService.deleteUserMessage(req.params.userMessageId);
  res.sendStatus(httpStatus.NO_CONTENT);
});

module.exports = {
  createUserMessage,
  getUserMessage,
  getUserMessages,
  updateUserMessage,
  deleteUserMessage,
};
