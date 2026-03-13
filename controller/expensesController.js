const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// CREATE EXPENSE
exports.createExpense = (req, res) => {
    const { expense, amount, date } = req.body;
    const company_id = req.user.id;

    if (!expense || !amount || !date) {
        return res.status(400).json({ error: 'Expense, amount, and date are required' });
    }

    connection.query(
        'INSERT INTO expenses (expense, amount, date, company_id) VALUES (?, ?, ?, ?)',
        [expense, amount, date, company_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Expense created successfully', expenseId: result.insertId });
        }
    );
};

// GET ALL EXPENSES
exports.getAllExpenses = (req, res) => {
    const company_id = req.user.id;
    connection.query('SELECT * FROM expenses WHERE company_id = ?', [company_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// GET SINGLE EXPENSE
exports.getExpenseById = (req, res) => {
    const { id } = req.params;
    const company_id = req.user.id;

    connection.query('SELECT * FROM expenses WHERE eID = ? AND company_id = ?', [id, company_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Expense not found' });
        res.json(results[0]);
    });
};

// UPDATE EXPENSE
exports.updateExpense = (req, res) => {
    const { id } = req.params;
    const { expense, amount, date } = req.body;
    const company_id = req.user.id;

    connection.query(
        'UPDATE expenses SET expense = ?, amount = ?, date = ? WHERE eID = ? AND company_id = ?',
        [expense, amount, date, id, company_id],
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
    const company_id = req.user.id;

    connection.query('DELETE FROM expenses WHERE eID = ? AND company_id = ?', [id, company_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Expense not found' });
        res.json({ message: 'Expense deleted successfully' });
    });
};

// GET PROFIT SUMMARY
exports.getProfitSummary = (req, res) => {
    const company_id = req.user.id;
    const profitQuery = `
        SELECT 
            (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM customers WHERE company_id = ?) AS total_sales,
            (SELECT COALESCE(SUM(quantity * price), 0) FROM suppliers WHERE company_id = ?) AS total_supplier_costs,
            (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE company_id = ?) AS total_other_expenses
    `;

    connection.query(profitQuery, [company_id, company_id, company_id], (err, results) => {
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