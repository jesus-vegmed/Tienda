const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:code', couponController.validateCoupon);
router.post('/', verifyToken(true), couponController.createCoupon);

module.exports = router;
