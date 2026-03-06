// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { adminAuth } = require('../middleware/adminMiddleware'); // JWT middleware for admin

// --- All routes protected by adminAuth ---
router.get('/getallcompanies', adminAuth, adminController.getAllCompanies);
router.get('/getcompanybyid/:id', adminAuth, adminController.getCompanyById);
// router.post('/createcompany', adminAuth, adminController.createCompany);
router.put('/updatecompany/:id', adminAuth, adminController.updateCompany);
router.delete('/deletecompany/:id', adminAuth, adminController.deleteCompany);

module.exports = router;