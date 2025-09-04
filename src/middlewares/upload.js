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

// Filter để chỉ cho phép file video
const videoFileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file video (mp4, avi, mov, mkv, webm)'), false);
  }
};

// Filter cho phép cả ảnh, video và nhiều loại file khác
const mediaFileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // Videos
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/mkv',
    'video/webm',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf',
    // Spreadsheets
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/flac',
    'audio/aac',
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh, video, document, audio hoặc archive'), false);
  }
};

// Middleware cho pictures (multiple uploads)
const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4000000 }, // Giới hạn kích thước file (4MB)
}).array('image', 1000); // Cho phép upload tối đa 1000 file

// Middleware cho videos (multiple uploads)
const uploadVideo = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 50000000 }, // Giới hạn kích thước file (50MB)
}).array('video', 100); // Cho phép upload tối đa 100 file

// Middleware cho cả ảnh, video và nhiều loại file khác (multiple uploads)
const uploadMedia = multer({
  storage,
  fileFilter: mediaFileFilter,
  limits: { fileSize: 100000000 }, // Giới hạn kích thước file (100MB)
}).array('media', 1000); // Cho phép upload tối đa 1000 file

module.exports = {
  uploadImage,
  uploadVideo,
  uploadMedia,
};
