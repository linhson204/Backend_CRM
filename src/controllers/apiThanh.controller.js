const catchAsync = require('../utils/catchAsync');
const apiThanh = require('../services/apiThanh.service');

const getCommentData = catchAsync(async (req, res) => {
  const data = await apiThanh.getCommentData(req, res);
  res.json(data);
});

const updateKpi = catchAsync(async (req, res) => {
  const data = await apiThanh.updateKpi(req, res);
  res.json(data);
});

const answerQuestion = catchAsync(async (req, res) => {
  const data = await apiThanh.answerQuestion(req, res);
  res.json(data);
});

const getQuestionData = catchAsync(async (req, res) => {
  const data = await apiThanh.getQuestionData(req, res);
  res.json(data);
});

const sendCommand = catchAsync(async (req, res) => {
  const data = await apiThanh.sendCommand(req, res);
  res.json(data);
});

const getGroupsData = catchAsync(async (req, res) => {
  const data = await apiThanh.getGroupsData(req, res);
  res.json(data);
});

const uploadFile = catchAsync(async (req, res) => {
  const data = await apiThanh.uploadFile(req); // chỉ cần truyền req
  res.json(data);
});

const getFile = catchAsync(async (req, res) => {
  await apiThanh.getFile(req, res); // stream nên service pipe thẳng ra res
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
};
