/**
 * @swagger
 * tags:
 *   name: Media
 *   description: API quản lý media (ảnh và video)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Media:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID media trong hệ thống
 *         link:
 *           type: string
 *           description: Đường dẫn media (local hoặc cloud)
 *         originalName:
 *           type: string
 *           description: Tên của của media
 *         savedName:
 *           type: string
 *           description: Public ID của media
 *         size:
 *           type: number
 *           description: Độ lớn của media
 *       example:
 *         id: "68a2a1b0c9c1d9332472427f"
 *         link: "/uploads/media-7368933a-212a-4ed6-a731-d458cf8df01d.xlsx"
 *         originalName: "bang_luong.xlsx"
 *         savedName: "media-7368933a-212a-4ed6-a731-d458cf8df01d.xlsx"
 *         size: "21396"
 */

/**
 * @swagger
 * /media:
 *   post:
 *     summary: Upload media mới (ảnh hoặc video)
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: File media cần upload (ảnh hoặc video)
 *     responses:
 *       201:
 *         description: Media đã được upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *
 * /media/getMedias:
 *   post:
 *     summary: Lấy danh sách media
 *     tags: [Media]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Id của CRM
 *               facebookId:
 *                 type: string
 *                 description: Id của Fb gửi file
 *     responses:
 *       200:
 *         description: Danh sách media (sắp xếp từ mới nhất đến cũ nhất)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Tổng số media
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Media'
 *               example:
 *                 page": 2,
 *                 limit": 20,
 *                 totalPages": 2,
 *                 totalResults: 21
 *                 results:
 *                   - id: "68abc114ed82ef2b0c05cbff"
 *                     link: "/uploads/media-c692368f-63ee-480c-99f0-cde9a79f966b.xlsx"
 *                     originalName: "bang_luong.xlsx"
 *                     savedName: "media-c692368f-63ee-480c-99f0-cde9a79f966b.xlsx"
 *                     size: 21396
 *
 * /media/{id}:
 *   get:
 *     summary: Lấy thông tin media theo ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID media
 *     responses:
 *       200:
 *         description: Thông tin media
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       404:
 *         description: Không tìm thấy media
 *
 *   delete:
 *     summary: Xóa media theo ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID media
 *     responses:
 *       204:
 *         description: Xóa media thành công
 *       404:
 *         description: Không tìm thấy media
 */

const express = require('express');
const mediaController = require('../controllers/media.controller');

const router = express.Router();

router.route('/').post(mediaController.createMedia);

router.route('/getMedias').post(mediaController.getMedias);

router.route('/:id').get(mediaController.getMediaById).delete(mediaController.deleteMedia);

module.exports = router;
