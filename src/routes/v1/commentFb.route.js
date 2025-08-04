const commentController = require('../../controllers/commentFb.controller');
// const auth = require('../../middlewares/auth');
const express = require('express');

const router = express.Router();

// router.route('/').post(auth(), commentController.createComment);

// router
//   .route('/:commentId')
//   .get(auth(), commentController.getCommentById)
//   .patch(auth(), commentController.updateCommentById)
//   .delete(auth(), commentController.deleteCommentById);

// router.route('/:commentId/feedback/').post(auth(), commentController.addFeedbackToComment);

// router
//   .route('/:commentId/feedback/:feedbackId')
//   .patch(auth(), commentController.updateFeedbackInComment)
//   .delete(auth(), commentController.deleteFeedbackFromComment);

// router.route('/post/:postId').get(auth(), commentController.getCommentsByPostId);

router.route('/').post(commentController.createComment);

router
  .route('/:commentId')
  .get(commentController.getCommentById)
  .patch(commentController.updateCommentById)
  .delete(commentController.deleteCommentById);

router.route('/:commentId/feedback/').post(commentController.addFeedbackToComment);

router
  .route('/:commentId/feedback/:feedbackId')
  .patch(commentController.updateFeedbackInComment)
  .delete(commentController.deleteFeedbackFromComment);

router.route('/post').post(commentController.getCommentsByPostId);
module.exports = router;
