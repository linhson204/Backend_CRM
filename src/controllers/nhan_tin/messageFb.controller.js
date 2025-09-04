const httpStatus = require('http-status');
const messageFbService = require('../../services/nhan_tin/messageFb.service');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

const createMessageFb = catchAsync(async (req, res) => {
  const message = await messageFbService.createMessageFb(req.body);
  res.status(httpStatus.CREATED).send(message);
});

const getMessage = catchAsync(async (req, res) => {
  const message = await messageFbService.getMessageFbById(req.params.messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  res.send(message);
});

const getMessages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userMessageId', 'createdAt']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Nếu không có sortBy trong query, mặc định sắp xếp theo createdAt desc (mới nhất trước)
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }

  if (!options.limit) {
    options.limit = '30';
  }

  const result = await messageFbService.queryMessageFb(filter, options);
  res.send(result);
});

const updateMessage = catchAsync(async (req, res) => {
  const message = await messageFbService.updateMessageFbById(req.params.messageId, req.body);
  res.send(message);
});

const deleteMessage = catchAsync(async (req, res) => {
  await messageFbService.deleteMessageFb(req.params.messageId);
  res.sendStatus(httpStatus.NO_CONTENT);
});

module.exports = {
  createMessageFb,
  getMessage,
  getMessages,
  updateMessage,
  deleteMessage,
};
