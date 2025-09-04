const express = require('express');
const groupController = require('../../controllers/dang_bai_group/group.controller');

const router = express.Router();

router.route('/get_data_group').post(groupController.getGroups);
router.route('/upload_answer').post(groupController.uploadAnswer);
router.route('/get_question_data').post(groupController.getQuestionData);
router.route('/send_command').post(groupController.sendCommand);

module.exports = router;
