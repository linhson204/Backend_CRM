const express = require('express');
const apiThanh = require('../controllers/apiThanh.controller');

const router = express.Router();

router.route('/get_comment_data').post(apiThanh.getCommentData);
router.route('/update_kpi').post(apiThanh.updateKpi);
router.route('/answer_question').post(apiThanh.answerQuestion);
router.route('/get_question_data').post(apiThanh.getQuestionData);
router.route('/send_command').post(apiThanh.sendCommand);
router.route('/get_groups_data').post(apiThanh.getGroupsData);
router.route('/upload_file').post(apiThanh.uploadFile);
router.route('/get_file').post(apiThanh.getFile);

module.exports = router;
