const UserMessage = require('../../models/nhan_tin/userMessage.model');

const createUserMessage = async (userMessageBody) => {
  // Kiểm tra xem đã có userMessage với messageId, userId, facebookId này chưa
  const existingUserMessage = await UserMessage.findOne({
    messageId: userMessageBody.messageId,
    userId: userMessageBody.userId,
    facebookId: userMessageBody.facebookId,
  });

  // Nếu đã có thì trả về userMessage hiện tại, không tạo mới
  if (existingUserMessage) {
    return existingUserMessage;
  }

  // Nếu chưa có thì tạo mới
  const userMessage = UserMessage.create(userMessageBody);
  return userMessage;
};

const getUserMessageById = async (userMessageId) => {
  return UserMessage.findById(userMessageId);
};

const queryUserMessage = async (filter, options) => {
  const userMessages = UserMessage.paginate(filter, options);
  return userMessages;
};

const updateUserMessageById = async (userMessageId, updateBody) => {
  const userMessage = await getUserMessageById(userMessageId);
  if (!userMessage) {
    throw new Error('UserMessage not found');
  }
  Object.assign(userMessage, updateBody);
  await userMessage.save();
  return userMessage;
};

const deleteUserMessage = async (userMessageId) => {
  const userMessage = await getUserMessageById(userMessageId);
  if (!userMessage) {
    throw new Error('UserMessage not found');
  }
  await userMessage.remove();
  return userMessage;
};

module.exports = {
  createUserMessage,
  getUserMessageById,
  queryUserMessage,
  updateUserMessageById,
  deleteUserMessage,
};
