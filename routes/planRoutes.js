const express = require('express');
const router = express.Router();
const planController = require('../controller/planController');
const { verifyToken } = require('../middleware/authMiddleware');
const { adminAuth } = require('../middleware/adminMiddleware');

// Public/User routes
router.get('/getall', verifyToken, planController.getAllPlans);
router.get('/current', verifyToken, planController.getCurrentPlan);
router.post('/activate', verifyToken, planController.activatePlan);

// Admin routes
router.post('/create', adminAuth, planController.createPlan);
router.put('/update/:id', adminAuth, planController.updatePlan);
router.delete('/delete/:id', adminAuth, planController.deletePlan);

module.exports = router;
