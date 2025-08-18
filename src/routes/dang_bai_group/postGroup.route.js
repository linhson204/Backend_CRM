const express = require('express');

const router = express.Router();
const postGroupController = require('../../controllers/dang_bai_group/postGroup.controller');

router.route('/').post(postGroupController.createPost).get(postGroupController.getPosts);

router
  .route('/:postId')
  .get(postGroupController.getPost)
  .patch(postGroupController.updatePost)
  .delete(postGroupController.deletePost);

module.exports = router;
