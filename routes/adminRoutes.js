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

// Dashboard data routes
router.get('/logs', adminAuth, adminController.getUsageLogs);
router.get('/ai-usage', adminAuth, adminController.getAIUsage);
router.get('/system-stats', adminAuth, adminController.getSystemStats);

module.exports = router;