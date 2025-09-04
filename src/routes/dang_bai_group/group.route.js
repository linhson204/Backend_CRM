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
 * /groups:
 *   get:
 *     summary: "Lấy danh sách nhóm"
 *     tags: [DangBaiGroup]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: "ID người dùng để lọc theo trạng thái tham gia"
 *       - in: query
 *         name: groupName
 *         required: false
 *         schema:
 *           type: string
 *         description: "Tên nhóm để tìm kiếm (hỗ trợ regex)"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: "Số lượng giới hạn (0 = không giới hạn)"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Trang hiện tại"
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

router.route('/').post(groupController.getGroups);

module.exports = router;
