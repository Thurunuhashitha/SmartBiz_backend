const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { verifyToken } = require('../middleware/authMiddleware');

// Routes
router.get('/getAllProducts', verifyToken, productController.getAllProducts);

module.exports = router;
