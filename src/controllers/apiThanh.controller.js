const catchAsync = require('../utils/catchAsync');
const apiThanh = require('../services/apiThanh.service');

const getCommentData = catchAsync(async (req, res) => {
  const data = await apiThanh.getCommentData(req, res);
  return data;
});

const updateKpi = catchAsync(async (req, res) => {
  const data = await apiThanh.updateKpi(req, res);
  return data;
});

const answerQuestion = catchAsync(async (req, res) => {
  const data = await apiThanh.answerQuestion(req, res);
  return data;
});

const getQuestionData = catchAsync(async (req, res) => {
  const data = await apiThanh.getQuestionData(req, res);
  return data;
});

const sendCommand = catchAsync(async (req, res) => {
  const data = await apiThanh.sendCommand(req, res);
  return data;
});

const getGroupsData = catchAsync(async (req, res) => {
  const data = await apiThanh.getGroupsData(req, res);
  return data;
});

const uploadFile = catchAsync(async (req, res) => {
  const data = await apiThanh.uploadFile(req, res); // chỉ cần truyền req
  return data;
});

const getFile = catchAsync(async (req, res) => {
  await apiThanh.getFile(req, res); // stream nên service pipe thẳng ra res
});

// ==========================================
const getCommandDataBase = catchAsync(async (req, res) => {
  await apiThanh.getCommandDataBase(req, res); // stream nên service pipe thẳng ra res
});

const getBaiDangDataBase = catchAsync(async (req, res) => {
  await apiThanh.getBaiDangDataBase(req, res); // stream nên service pipe thẳng ra res
});

module.exports = {
  getCommentData,
  updateKpi,
  answerQuestion,
  getQuestionData,
  sendCommand,
  getGroupsData,
  uploadFile,
  getFile,
  getCommandDataBase,
  getBaiDangDataBase,
};
