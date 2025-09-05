/**
 * @swagger
 * tags:
 *   - name: DangBaiGroup
 *     description: "Quản lý nhóm đăng bài"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của nhóm
 *         Name:
 *           type: string
 *           description: Tên nhóm
 *         Joined_Accounts:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách tài khoản đã tham gia
 *         Temp_Joined_Accounts:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách tài khoản chờ duyệt
 *         user_status:
 *           type: string
 *           enum: ["Đã tham gia", "Chờ duyệt", "Chưa tham gia", "Không xác định"]
 *           description: Trạng thái của user với nhóm
 *       example:
 *         _id: "64a1b2c3d4e5f6789012345"
 *         Name: "Nhóm ABC"
 *         Joined_Accounts: ["user1", "user2"]
 *         Temp_Joined_Accounts: ["user3"]
 *         user_status: "Đã tham gia"
 *
 *     GroupsResponse:
 *       type: object
 *       properties:
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Group'
 *         page:
 *           type: integer
 *           description: Trang hiện tại
 *         limit:
 *           type: integer
 *           description: Số lượng mỗi trang
 *         totalResults:
 *           type: integer
 *           description: Tổng số kết quả
 */

/**
 * @swagger
 * /groups/get_data_group:
 *   post:
 *     summary: "Lấy danh sách nhóm"
 *     tags: [DangBaiGroup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: "ID người dùng để lọc theo trạng thái tham gia"
 *               group_name:
 *                 type: string
 *                 description: "Tên nhóm để tìm kiếm (hỗ trợ regex)"
 *               user_status:
 *                 type: string
 *                 enum: ["Đã tham gia", "Chờ duyệt", "Chưa tham gia"]
 *                 description: "Lọc theo trạng thái tham gia của user"
 *               limit:
 *                 type: integer
 *                 default: 0
 *                 description: "Số lượng giới hạn (0 = không giới hạn)"
 *               page:
 *                 type: integer
 *                 default: 1
 *                 description: "Trang hiện tại"
 *           example:
 *             user_id: "user123"
 *             group_name: "Nhóm ABC"
 *             user_status: "Chưa tham gia"
 *             limit: 10
 *             page: 1
 *     responses:
 *       200:
 *         description: "Danh sách nhóm"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupsResponse'
 */

const express = require('express');
const groupController = require('../../controllers/dang_bai_group/group.controller');

const router = express.Router();

router.route('/get_data_group').post(groupController.getGroups);
router.route('/upload_answer').post(groupController.uploadAnswer);
router.route('/get_question_data').post(groupController.getQuestionData);
router.route('/send_command').post(groupController.sendCommand);

module.exports = router;
