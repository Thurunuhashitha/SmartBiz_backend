const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require token
router.post('/createProduct', verifyToken, productController.createProduct);
router.get('/getAllProducts', verifyToken, productController.getAllProducts);
router.get('/getProductById/:id', verifyToken, productController.getProductById);
router.put('/updateProduct/:id', verifyToken, productController.updateProduct);
router.delete('/deleteProduct/:id', verifyToken, productController.deleteProduct);

module.exports = router;