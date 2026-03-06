const express = require('express');
const router = express.Router();
const salesController = require('../controller/salesController');
const { verifyToken } = require('../middleware/authMiddleware'); // optional JWT auth

// Routes
router.post('/createSale', verifyToken, salesController.createSale);
router.get('/getAllSales', verifyToken, salesController.getAllSales);
router.get('/getSaleById/:id', verifyToken, salesController.getSaleById);
router.put('/updateSale/:id', verifyToken, salesController.updateSale);
router.delete('/deleteSale/:id', verifyToken, salesController.deleteSale);

module.exports = router;