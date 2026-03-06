const express = require('express');
const router = express.Router();
const expensesController = require('../controller/expensesController');
const { verifyToken } = require('../middleware/authMiddleware'); // optional JWT auth

// Routes
router.post('/createExpense', verifyToken, expensesController.createExpense);
router.get('/getAllExpenses', verifyToken, expensesController.getAllExpenses);
router.get('/getExpenseById/:id', verifyToken, expensesController.getExpenseById);
router.put('/updateExpense/:id', verifyToken, expensesController.updateExpense);
router.delete('/deleteExpense/:id', verifyToken, expensesController.deleteExpense);

module.exports = router;