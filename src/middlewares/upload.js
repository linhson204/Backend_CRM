// Import các thư viện cần thiết
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const cloudinary = require('../config/cloudinary'); // Import cấu hình Cloudinary

// Cấu hình lưu trữ với Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // Thư mục trong Cloudinary
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif'], // Các định dạng được phép
    public_id: (req, file) => `${file.fieldname}-${uuidv4()}`, // Tạo tên file với UUID
  },
});

// Middleware cho pictures (multiple uploads)
const uploadImage = multer({
  storage,
  limits: { fileSize: 1000000 }, // Giới hạn kích thước file (1MB)
}).array('image', 100); // Cho phép upload tối đa 100 file

module.exports = {
  uploadImage,
};
