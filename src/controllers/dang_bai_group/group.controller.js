const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const groupService = require('../../services/dang_bai_group/group.service');

const getGroups = catchAsync(async (req, res) => {
  const { user_id, group_name = '', limit = 0, page = 1, user_status } = req.body;

  // Lấy tất cả groups từ service (không có pagination)
  const allGroups = await groupService.getGroupsData(user_id, group_name, user_status);

  const totalResults = allGroups.length;
  const limitNum = parseInt(limit, 10);
  const pageNum = parseInt(page, 10);

  // Thực hiện pagination ở controller
  let paginatedGroups = allGroups;
  if (limitNum > 0) {
    const skip = (pageNum - 1) * limitNum;
    paginatedGroups = allGroups.slice(skip, skip + limitNum);
  }

  res.status(httpStatus.OK).send({
    results: paginatedGroups,
    page: pageNum,
    limit: limitNum,
    totalResults: totalResults,
    totalPages: limitNum > 0 ? Math.ceil(totalResults / limitNum) : 1,
  });
});

const uploadAnswer = async (req, res) => {
  const { group_link, question, answer } = req.body;
  const groupsAnswer = await groupService.uploadAnswer(group_link, question, answer);
  res.status(httpStatus.OK).send({
    results: groupsAnswer,
    totalResults: groupsAnswer.length,
  });
};

const getQuestionData = async (req, res) => {
  const { status = '', group_name = '', limit = 0, page = 1 } = req.body;
  const questionData = await groupService.getQuestionData(status, group_name, limit, page);
  res.status(httpStatus.OK).send({
    results: questionData,
    page: page,
    limit: limit,
    totalResults: questionData.length,
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
