const MessageFb = require('../../models/nhan_tin/messageFb.model');

const createMessageFb = async (messageBody) => {
  const message = MessageFb.create(messageBody);
  return message;
};

const getMessageFbById = async (messageId) => {
  return MessageFb.findById(messageId);
};

const queryMessageFb = async (filter, options) => {
  const messages = MessageFb.paginate(filter, options);
  return messages;
};

const updateMessageFbById = async (messageId, updateBody) => {
  const message = await getMessageFbById(messageId);
  if (!message) {
    throw new Error('MessageFb not found');
  }
  Object.assign(message, updateBody);
  await message.save();
  return message;
};

const deleteMessageFb = async (messageId) => {
  const message = await getMessageFbById(messageId);
  if (!message) {
    throw new Error('MessageFb not found');
  }
  await message.remove();
  return message;
};

module.exports = {
  createMessageFb,
  getMessageFbById,
  queryMessageFb,
  updateMessageFbById,
  deleteMessageFb,
};
