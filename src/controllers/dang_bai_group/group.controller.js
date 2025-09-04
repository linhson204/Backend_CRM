const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const groupService = require('../../services/dang_bai_group/group.service');

const getGroups = catchAsync(async (req, res) => {
  const { userId, groupName, limit, page } = req.body;

  const limitNum = limit ? parseInt(limit, 10) : 0;
  const pageNum = page ? parseInt(page, 10) : 1;

  const groups = await groupService.getGroupsData(userId, groupName, limitNum, pageNum);

  res.status(httpStatus.OK).send({
    results: groups,
    page: pageNum,
    limit: limitNum,
    totalResults: groups.length,
  });
});

module.exports = {
  getGroups,
};
