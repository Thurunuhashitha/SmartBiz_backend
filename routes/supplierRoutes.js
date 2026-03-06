const express = require('express');
const router = express.Router();
const supplierController = require('../controller/supplierController');
const { verifyToken } = require('../middleware/authMiddleware'); // optional JWT auth

// Routes
router.post('/createSupplier', verifyToken, supplierController.createSupplier);
router.get('/getAllSuppliers', verifyToken, supplierController.getAllSuppliers);
router.get('/getSupplierById/:id', verifyToken, supplierController.getSupplierById);
router.put('/updateSupplier/:id', verifyToken, supplierController.updateSupplier);
router.delete('/deleteSupplier/:id', verifyToken, supplierController.deleteSupplier);

module.exports = router;