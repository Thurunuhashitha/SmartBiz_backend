const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware'); // Assuming this exists based on usual patterns

router.get('/getStats', verifyToken, dashboardController.getDashboardStats);

module.exports = router;
