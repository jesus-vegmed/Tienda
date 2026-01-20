const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', verifyToken(true), productController.createProduct);
router.put('/:id', verifyToken(true), productController.updateProduct);
router.delete('/:id', verifyToken(true), productController.deleteProduct);

module.exports = router;
