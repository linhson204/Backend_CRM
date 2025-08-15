const express = require('express');
// const auth = require('../../middlewares/auth');
const router = express.Router();
const postController = require('../../controllers/dang_bai_tcn/postFb.controller');

// router
//     .route('/')
//     .post(auth(), postController.createPost)
//     .get(auth(), postController.getPosts);

// router
//     .route('/:postId')
//     .get(auth(), postController.getPost)
//     .patch(auth(), postController.updatePost)
//     .delete(auth(), postController.deletePost);

router.route('/').post(postController.createPost).get(postController.getPosts);

router.route('/:postId').get(postController.getPost).patch(postController.updatePost).delete(postController.deletePost);

module.exports = router;
