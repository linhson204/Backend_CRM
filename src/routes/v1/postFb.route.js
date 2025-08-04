const express = require('express');
const postController = require('../../controllers/postFb.controller');
// const auth = require('../../middlewares/auth');
const router = express.Router();

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
