const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const mediaService = require('../services/media.service');
const ApiError = require('../utils/ApiError');

const createMedia = catchAsync(async (req, res) => {
  await mediaService.createMedia(req, res);
});

const getMediaById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const media = await mediaService.getMediaById(id);
  if (!media) throw new ApiError(httpStatus.NOT_FOUND, 'Media not found!');
  res.send(media);
});

const getMedias = catchAsync(async (req, res) => {
  const filter = { ...req.body };
  delete filter.page;
  delete filter.limit;
  delete filter.sortBy;

  const options = {
    sortBy: req.body.sortBy || 'createdAt:desc',
    page: parseInt(req.body.page, 10) || 1,
    limit: parseInt(req.body.limit, 10) || 20,
  };

  const result = await mediaService.getMedias(filter, options);
  res.send(result);
});

const deleteMedia = catchAsync(async (req, res) => {
  const media = await mediaService.deleteMediaById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send(media);
});

module.exports = {
  createMedia,
  getMediaById,
  getMedias,
  deleteMedia,
};
