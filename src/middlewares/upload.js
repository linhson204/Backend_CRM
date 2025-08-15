// Import các thư viện cần thiết
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import UUID

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Thư mục lưu file
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique với UUID và giữ nguyên extension
    const fileExtension = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${uuidv4()}${fileExtension}`;
    cb(null, fileName);
  },
});

// Filter để chỉ cho phép file ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh (jpeg, jpg, png, gif)'), false);
  }
};

// Middleware cho pictures (multiple uploads)
const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4000000 }, // Giới hạn kích thước file (4MB)
}).array('image', 1000); // Cho phép upload tối đa 100 file

module.exports = {
  uploadImage,
};
