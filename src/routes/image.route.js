const express = require('express');
const imageController = require('../controllers/image.controller');

const router = express.Router();

router.route('/').post(imageController.createImage).get(imageController.getImages);

router.route('/:id').get(imageController.getImageById).delete(imageController.deleteImage);

module.exports = router;
