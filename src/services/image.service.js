const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Image } = require('../models'); // Đường dẫn tới file chứa model Image
const { uploadImage } = require('../middlewares/upload');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary config

/**
 * Create a user
 * @param {Object} ImageBody
 * @returns {Promise<Image>}
 */
const createImage = async (req, res) => {
  uploadImage(req, res, async (err) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: err.message });
    }
    if (!req.files) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'No file uploaded' });
    }

    try {
      const Images = await Promise.all(
        req.files.map((file) => {
          return Image.create({
            link: file.path,
            public_id: file.filename,
          });
        })
      );
      return res.status(httpStatus.OK).send(Images);
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    }
  });
};

const getImageById = async (id) => {
  return Image.findById(id);
};

// eslint-disable-next-line no-unused-vars
const getImages = async (req, res) => {
  return Image.find({ ...req.query });
};

const deleteImageById = async (id) => {
  const image = await getImageById(id);
  if (!image) throw new ApiError(httpStatus.NOT_FOUND, 'image Not Found!');

  // Xóa ảnh từ Cloudinary
  try {
    console.log('public_id cần xóa:', image.public_id);
    const result = await cloudinary.uploader.destroy(image.public_id);
    console.log('Kết quả xóa:', result);
    if (result.result !== 'ok') {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete image from Cloudinary');
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while deleting image from Cloudinary');
  }
  await Image.findByIdAndDelete(id);
  return image;
};

module.exports = {
  createImage,
  getImageById,
  getImages,
  deleteImageById,
};
