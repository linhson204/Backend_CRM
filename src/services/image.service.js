const httpStatus = require('http-status');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');
const { Image } = require('../models'); // Đường dẫn tới file chứa model Image
const { uploadImage } = require('../middlewares/upload');

/**
 * Create images
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<Array>}
 */
const createImage = async (req, res) => {
  uploadImage(req, res, async (err) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'No file uploaded' });
    }

    try {
      const Images = await Promise.all(
        req.files.map((file) => {
          return Image.create({
            link: `/uploads/${file.filename}`, // Đường dẫn relative để serve static
            public_id: file.filename, // Sử dụng filename làm public_id
            originalName: file.originalname,
            size: file.size,
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

const getImages = async (req, res) => {
  return Image.find({ ...req.query });
};

const deleteImageById = async (id) => {
  const image = await getImageById(id);
  if (!image) throw new ApiError(httpStatus.NOT_FOUND, 'Image Not Found!');

  // Xóa file ảnh từ thư mục uploads
  try {
    const filePath = path.join(__dirname, '../../uploads', image.public_id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Đã xóa file:', filePath);
    }
  } catch (error) {
    console.error('Lỗi khi xóa file:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while deleting image file');
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
