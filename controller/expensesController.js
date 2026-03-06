const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// CREATE EXPENSE
exports.createExpense = (req, res) => {
    const { expense, amount, date } = req.body;

    if (!expense || !amount || !date) {
        return res.status(400).json({ error: 'Expense, amount, and date are required' });
    }

    connection.query(
        'INSERT INTO expenses (expense, amount, date) VALUES (?, ?, ?)',
        [expense, amount, date],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Expense created successfully', expenseId: result.insertId });
        }
    );
};

// GET ALL EXPENSES
exports.getAllExpenses = (req, res) => {
    connection.query('SELECT * FROM expenses', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// GET SINGLE EXPENSE
exports.getExpenseById = (req, res) => {
    const { id } = req.params;

    connection.query('SELECT * FROM expenses WHERE eID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Expense not found' });
        res.json(results[0]);
    });
};

// UPDATE EXPENSE
exports.updateExpense = (req, res) => {
    const { id } = req.params;
    const { expense, amount, date } = req.body;

    connection.query(
        'UPDATE expenses SET expense = ?, amount = ?, date = ? WHERE eID = ?',
        [expense, amount, date, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Expense not found' });
            res.json({ message: 'Expense updated successfully' });
        }
    );
};

// DELETE EXPENSE
exports.deleteExpense = (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM expenses WHERE eID = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Expense not found' });
        res.json({ message: 'Expense deleted successfully' });
    });
};