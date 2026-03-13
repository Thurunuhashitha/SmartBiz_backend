const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');
const { verifyToken } = require('../middleware/authMiddleware'); // optional JWT auth

// Routes
router.post('/createCustomer', verifyToken, customerController.createCustomer);
router.get('/getAllCustomers', verifyToken, customerController.getAllCustomers);
router.get('/getCustomerById/:id', verifyToken, customerController.getCustomerById);
router.put('/updateCustomer/:id', verifyToken, customerController.updateCustomer);
router.delete('/deleteCustomer/:id', verifyToken, customerController.deleteCustomer);

module.exports = router;