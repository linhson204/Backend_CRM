/**
 * @swagger
 * tags:
 *   - name: DangBaiTCN
 *     description: "Quản lý bài viết TCN"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Attachment:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [image, video]
 *         url:
 *           type: string
 *         name:
 *           type: string
 *       example:
 *         type: "image"
 *         url: "https://example.com/img.png"
 *         name: "Ảnh minh họa"
 *
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "689c1610dd27074f18321076"
 *         userId:
 *           type: string
 *           example: "22614471"
 *         facebookId:
 *           type: string
 *           example: "B22735395"
 *         userNameFacebook:
 *           type: string
 *           example: "Nguyen Van A"
 *         content:
 *           type: string
 *           example: "Nội dung bài viết..."
 *         attachments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Attachment'
 *         facebookPostId:
 *           type: string
 *           example: "123456789"
 *         isPosted:
 *           type: boolean
 *           example: true
 *         facebookPostUrl:
 *           type: string
 *           example: "https://facebook.com/123456789"
 *         createdAt:
 *           type: number
 *           example: 1713358123
 *         updatedAt:
 *           type: number
 *           example: 1713358123
 *         commentsCount:
 *           type: number
 *           example: 0
 *
 *     PaginatedPosts:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 2
 *         totalResults:
 *           type: integer
 *           example: 17
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * /post:
 *   get:
 *     summary: "Lấy danh sách bài viết (có phân trang)"
 *     tags: [DangBaiTCN]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID người dùng (VD: 22858640)"
 *       - in: query
 *         name: facebookId
 *         required: true
 *         schema:
 *           type: string
 *         description: "Facebook ID (VD: B22623688)"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Trang hiện tại"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Số bài viết mỗi trang"
 *     responses:
 *       200:
 *         description: "Danh sách bài viết có phân trang"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPosts'
 *
 *   post:
 *     summary: "Tạo bài viết mới"
 *     tags: [DangBaiTCN]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: "Tạo thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * /post/{postId}:
 *   get:
 *     summary: "Lấy chi tiết bài viết"
 *     tags: [DangBaiTCN]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID bài viết"
 *     responses:
 *       200:
 *         description: "Chi tiết bài viết"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 *   patch:
 *     summary: "Cập nhật bài viết"
 *     tags: [DangBaiTCN]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID bài viết"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: "Cập nhật thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 *   delete:
 *     summary: "Xóa bài viết"
 *     tags: [DangBaiTCN]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID bài viết"
 *     responses:
 *       200:
 *         description: "Xóa thành công"
 */

const express = require('express');

const router = express.Router();

const postController = require('../../controllers/dang_bai_tcn/postFb.controller');

router.route('/').post(postController.createPost).get(postController.getPosts);

router.route('/:postId').get(postController.getPost).patch(postController.updatePost).delete(postController.deletePost);

module.exports = router;
