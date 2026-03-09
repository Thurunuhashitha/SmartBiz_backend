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

// GET PROFIT SUMMARY
exports.getProfitSummary = (req, res) => {
    const profitQuery = `
        SELECT 
            (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM customers) AS total_sales,
            (SELECT COALESCE(SUM(quantity * price), 0) FROM suppliers) AS total_supplier_costs,
            (SELECT COALESCE(SUM(amount), 0) FROM expenses) AS total_other_expenses
    `;

    connection.query(profitQuery, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        
        const data = results[0];
        const revenue = parseFloat(data.total_sales);
        const supplierCosts = parseFloat(data.total_supplier_costs);
        const otherExpenses = parseFloat(data.total_other_expenses);
        const netProfit = revenue - (supplierCosts + otherExpenses);

        res.json({
            revenue,
            supplierCosts,
            otherExpenses,
            netProfit
        });
    });
};