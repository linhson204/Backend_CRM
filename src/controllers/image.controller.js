const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { imageService } = require('../services');
const ApiError = require('../utils/ApiError');

const createImage = catchAsync(async (req, res) => {
  await imageService.createImage(req, res);
});

const getImageById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const image = await imageService.getImageById(id);
  if (!image) throw new ApiError(httpStatus.NOT_FOUND, 'Picture not found!');
  res.send(image);
});

const getImages = catchAsync(async (req, res) => {
  const images = await imageService.getImages(req, res);
  if (!images) throw new ApiError(httpStatus.NOT_FOUND, 'Picture not found!');
  res.send(images);
});

const deleteImage = catchAsync(async (req, res) => {
  const image = await imageService.deleteImageById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send(image);
});

module.exports = {
  createImage,
  getImageById,
  getImages,
  deleteImage,
};
