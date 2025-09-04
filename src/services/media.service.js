const httpStatus = require('http-status');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');
const Media = require('../models/media.model');
const { uploadMedia } = require('../middlewares/upload');

/**
 * Create media
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<Array>}
 */
const createMedia = async (req, res) => {
  uploadMedia(req, res, async (err) => {
    if (err) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'No file uploaded' });
    }

    try {
      const medias = await Promise.all(
        req.files.map((file) => {
          // Tạo object chỉ với các trường có giá trị
          const mediaData = {
            link: `/uploads/${file.filename}`, // Đường dẫn relative để serve static
            savedName: file.filename, // Sử dụng filename làm public_id
            originalName: file.originalname,
            size: file.size,
          };

          // Chỉ thêm các trường nếu chúng có giá trị
          if (req.body.userId) mediaData.userId = req.body.userId;
          if (req.body.facebookId) mediaData.facebookId = req.body.facebookId;
          if (req.body.userChatId) mediaData.userChatId = req.body.userChatId;

          return Media.create(mediaData);
        })
      );
      return res.status(httpStatus.OK).send(medias);
    } catch (error) {
      console.log(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    }
  });
};

const getMediaById = async (id) => {
  return Media.findById(id);
};

const getMedias = async (filter, options) => {
  const medias = Media.paginate(filter, options);
  return medias;
};

const deleteMediaById = async (id) => {
  const media = await getMediaById(id);
  if (!media) throw new ApiError(httpStatus.NOT_FOUND, 'Media Not Found!');

  // Xóa file media từ thư mục uploads
  try {
    const filePath = path.join(__dirname, '../../uploads', media.public_id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Đã xóa file:', filePath);
    }
  } catch (error) {
    console.error('Lỗi khi xóa file:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while deleting media file');
  }

  await Media.findByIdAndDelete(id);
  return media;
};

module.exports = {
  createMedia,
  getMediaById,
  getMedias,
  deleteMediaById,
};
