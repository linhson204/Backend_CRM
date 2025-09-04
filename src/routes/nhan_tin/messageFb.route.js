const express = require('express');

const router = express.Router();

const messageFbController = require('../../controllers/nhan_tin/messageFb.controller');

router.route('/').post(messageFbController.createMessageFb).get(messageFbController.getMessages);

router
  .route('/:messageId')
  .get(messageFbController.getMessage)
  .patch(messageFbController.updateMessage)
  .delete(messageFbController.deleteMessage);

module.exports = router;
