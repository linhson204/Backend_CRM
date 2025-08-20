const express = require('express');
const multer = require('multer');
const apiThanh = require('../controllers/apiThanh.controller');

// Lưu file vào RAM (buffer), không lưu ra disk
const uploadfile = multer({ storage: multer.memoryStorage() });
const upload = multer();

const router = express.Router();

router.route('/get_comment_data').post(upload.none(), apiThanh.getCommentData);
router.route('/update_kpi').post(upload.none(), apiThanh.updateKpi);
router.route('/answer_question').post(upload.none(), apiThanh.answerQuestion);
router.route('/get_question_data').post(upload.none(), apiThanh.getQuestionData);
router.route('/send_command').post(upload.none(), apiThanh.sendCommand);
router.route('/get_groups_data').post(upload.none(), apiThanh.getGroupsData);
router.route('/upload_file').post(uploadfile.single('file'), apiThanh.uploadFile);
router.route('/get_file').post(upload.none(), apiThanh.getFile);

module.exports = router;
