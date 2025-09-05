const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const groupService = require('../../services/dang_bai_group/group.service');

const getGroups = catchAsync(async (req, res) => {
  const { user_id, group_name = '', limit = 0, page = 1, user_status } = req.body;

  const groups = await groupService.getGroupsData(user_id, group_name, limit, page, user_status);

  res.status(httpStatus.OK).send({
    results: groups,
    page: page,
    limit: limit,
    totalResults: groups.length,
  });
});

const uploadAnswer = async (req, res) => {
  const { group_link, question, answer } = req.body;
  const groups = await groupService.uploadAnswer(group_link, question, answer);
  res.status(httpStatus.OK).send({
    results: groups,
    totalResults: groups.length,
  });
};

const getQuestionData = async (req, res) => {
  const { status = '', group_name = '', limit = 0, page = 1 } = req.body;
  const groups = await groupService.getQuestionData(status, group_name, limit, page);
  res.status(httpStatus.OK).send({
    results: groups,
    page: page,
    limit: limit,
    totalResults: groups.length,
  });
};

const sendCommand = async (req, res) => {
  try {
    const { crm_id, user_id, type, params } = req.body;
    const result = await sendCommandService(crm_id, user_id, type, params);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error('sendCommand error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getGroups,
  uploadAnswer,
  getQuestionData,
  sendCommand,
};
