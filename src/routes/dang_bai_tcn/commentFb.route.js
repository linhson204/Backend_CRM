const express = require('express');
const commentController = require('../../controllers/dang_bai_tcn/commentFb.controller');

const router = express.Router();

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

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: API quản lý Comment và Feedback
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *           example: 123456
 *         facebookId:
 *           type: string
 *           example: fb_001
 *         content:
 *           type: string
 *           example: Feedback cho comment này
 *         userNameFacebook:
 *           type: string
 *           example: Tran Van B
 *         replyToAuthor:
 *           type: string
 *           example: Nguyen Van A
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         post_id:
 *           type: string
 *         userId:
 *           type: string
 *           example: 123456
 *         facebookId:
 *           type: string
 *           example: fb_001
 *         postId:
 *           type: string
 *           example: 987654321
 *         userNameFacebook:
 *           type: string
 *           example: Nguyen Van A
 *         content:
 *           type: string
 *           example: Đây là comment mới
 *         facebookCommentId:
 *           type: string
 *         facebookCommentUrl:
 *           type: string
 *         listFeedback:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Feedback'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Tạo comment mới
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *               - userId
 *               - facebookId
 *               - content
 *             properties:
 *               post_id:
 *                 type: string
 *                 example: 64f1234567abcdef890
 *               userId:
 *                 type: string
 *                 example: 123456
 *               facebookId:
 *                 type: string
 *                 example: fb_001
 *               content:
 *                 type: string
 *                 example: Đây là comment đầu tiên
 *     responses:
 *       200:
 *         description: Comment được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /comment/{commentId}:
 *   get:
 *     summary: Lấy comment theo ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *
 *   patch:
 *     summary: Cập nhật comment theo ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Nội dung comment đã update
 *               userId:
 *                 type: string
 *                 example: 123456
 *               facebookId:
 *                 type: string
 *                 example: fb_001
 *     responses:
 *       200:
 *         description: Comment đã được update
 *
 *   delete:
 *     summary: Xóa comment theo ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment đã bị xóa
 */

/**
 * @swagger
 * /comment/{commentId}/feedback:
 *   post:
 *     summary: Thêm feedback vào comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *               - facebookId
 *               - replyToAuthor
 *               - userNameFacebook
 *               - userLinkFb
 *               - id_facebookReply
 *               - facebookReplyUrl
 *             properties:
 *               content:
 *                 type: string
 *                 example: Feedback cho comment
 *               replyToAuthor:
 *                 type: string
 *                 example: Nguyen Van A
 *               userId:
 *                 type: string
 *                 example: 123456
 *               facebookId:
 *                 type: string
 *                 example: fb_001
 *               userNameFacebook:
 *                 type: string
 *                 example: Tran Van B
 *               userLinkFb:
 *                 type: string
 *                 example: https://facebook.com/user/987654
 *               id_facebookReply:
 *                 type: string
 *                 example: 12365895213
 *               facebookReplyUrl:
 *                 type: string
 *                 example: https://facebook.com/reply/4567
 *     responses:
 *       200:
 *         description: Feedback được thêm thành công
 */

/**
 * @swagger
 * /comment/{commentId}/feedback/{feedbackId}:
 *   patch:
 *     summary: Cập nhật feedback trong comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Feedback đã update
 *               userId:
 *                 type: string
 *                 example: 123456
 *               facebookId:
 *                 type: string
 *                 example: fb_001
 *     responses:
 *       200:
 *         description: Feedback đã update
 *
 *   delete:
 *     summary: Xóa feedback trong comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback đã bị xóa
 */

/**
 * @swagger
 * /comment/post:
 *   post:
 *     summary: Lấy danh sách comment theo postId
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - userId
 *               - facebookId
 *             properties:
 *               postId:
 *                 type: string
 *                 example: 987654321
 *               userId:
 *                 type: string
 *                 example: 22858640
 *               facebookId:
 *                 type: string
 *                 example: B22623688
 *     responses:
 *       200:
 *         description: Danh sách comment theo postId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *                 totalResults:
 *                   type: integer
 *                   example: 17
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 */
