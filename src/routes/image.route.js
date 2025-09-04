/**
 * @swagger
 * tags:
 *   name: Images
 *   description: API quản lý hình ảnh
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID ảnh trong hệ thống
 *         link:
 *           type: string
 *           description: Đường dẫn ảnh (local hoặc cloud)
 *         public_id:
 *           type: string
 *           description: Public ID của ảnh
 *       example:
 *         id: "68a2a1b0c9c1d9332472427f"
 *         link: "/uploads/image-b310b2e6-be66-490a-a86b-670d26be569a.png"
 *         public_id: "image-b310b2e6-be66-490a-a86b-670d26be569a.png"
 */

/**
 * @swagger
 * /image:
 *   post:
 *     summary: Upload ảnh mới
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh cần upload
 *     responses:
 *       201:
 *         description: Ảnh đã được upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *
 *   get:
 *     summary: Lấy danh sách ảnh
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách ảnh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Image'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *               example:
 *                 results:
 *                   - id: "68a2a1b0c9c1d9332472427f"
 *                     link: "/uploads/image-b310b2e6-be66-490a-a86b-670d26be569a.png"
 *                     public_id: "image-b310b2e6-be66-490a-a86b-670d26be569a.png"
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 *                 totalResults: 1
 *
 * /image/{id}:
 *   get:
 *     summary: Lấy thông tin ảnh theo ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ảnh
 *     responses:
 *       200:
 *         description: Thông tin ảnh
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *       404:
 *         description: Không tìm thấy ảnh
 *
 *   delete:
 *     summary: Xóa ảnh theo ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ảnh
 *     responses:
 *       204:
 *         description: Xóa ảnh thành công
 *       404:
 *         description: Không tìm thấy ảnh
 */

const express = require('express');
const imageController = require('../controllers/image.controller');

const router = express.Router();

router.route('/').post(imageController.createImage).get(imageController.getImages);

router.route('/:id').get(imageController.getImageById).delete(imageController.deleteImage);

module.exports = router;
