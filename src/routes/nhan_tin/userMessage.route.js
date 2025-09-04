/**
 * @swagger
 * tags:
 *   - name: NhanTin1-1
 *     description: "Quản lý số người nhắn tin"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Attachment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         messageId:
 *           type: string
 *         userId:
 *           type: string
 *         facebookId:
 *           type: string
 *         sender:
 *           type: string
 *         lastMessage:
 *           type: string
 *         createdAt:
 *           type: number
 *         updatedAt:
 *           type: number
 *       example:
 *         _id: "68ac1f080a7c412a78c62953"
 *         messageId: "123459"
 *         userId: "001"
 *         facebookId: "B001"
 *         sender: "Nguyen Van C"
 *         lastMessage: "1p"
 *         createdAt: 1692950400
 *         updatedAt: 1692950400
 *
 *     UserMessage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68ac1f080a7c412a78c6295"
 *         userId:
 *           type: string
 *           example: "22614471"
 *         facebookId:
 *           type: string
 *           example: "B22735395"
 *         messageId:
 *           type: string
 *           example: "123456789"
 *         sender:
 *           type: string
 *           example: "Nguyen Van A"
 *         lastMessage:
 *           type: string
 *           example: "1p"
 *         createdAt:
 *           type: number
 *           example: 1713358123
 *         updatedAt:
 *           type: number
 *           example: 1713358123
 *
 *     PaginatedUserMessage:
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
 *             $ref: '#/components/schemas/UserMessage'
 */

/**
 * @swagger
 * /userMessage:
 *   get:
 *     summary: "Lấy danh sách userMessage (có phân trang)"
 *     tags: [NhanTin1-1]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: "ID người dùng (VD: 22858640)"
 *       - in: query
 *         name: facebookId
 *         required: false
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
 *         description: "Số userMessage mỗi trang"
 *     responses:
 *       200:
 *         description: "Danh sách userMessage có phân trang"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUserMessage'
 *
 *   post:
 *     summary: "Tạo userMessage mới"
 *     tags: [NhanTin1-1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserMessage'
 *     responses:
 *       201:
 *         description: "Tạo thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMessage'
 */

/**
 * @swagger
 * /userMessage/{userMessageId}:
 *   get:
 *     summary: "Lấy chi tiết userMessage"
 *     tags: [NhanTin1-1]
 *     parameters:
 *       - in: path
 *         name: userMessageId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID userMessage"
 *     responses:
 *       200:
 *         description: "Chi tiết userMessage"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMessage'
 *
 *   patch:
 *     summary: "Cập nhật userMessage"
 *     tags: [NhanTin1-1]
 *     parameters:
 *       - in: path
 *         name: userMessageId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID userMessage"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserMessage'
 *     responses:
 *       200:
 *         description: "Cập nhật thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMessage'
 *
 *   delete:
 *     summary: "Xóa userMessage"
 *     tags: [NhanTin1-1]
 *     parameters:
 *       - in: path
 *         name: userMessageId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID userMessage"
 *     responses:
 *       204:
 *         description: "Xóa thành công"
 */

const express = require('express');

const router = express.Router();

const userMessageController = require('../../controllers/nhan_tin/userMessage.controller');

router.route('/').post(userMessageController.createUserMessage).get(userMessageController.getUserMessages);

router
  .route('/:userMessageId')
  .get(userMessageController.getUserMessage)
  .patch(userMessageController.updateUserMessage)
  .delete(userMessageController.deleteUserMessage);

module.exports = router;
