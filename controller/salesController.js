const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// CREATE SALE
exports.createSale = (req, res) => {
    const { product, quantity, price, date, customer } = req.body;

    if (!product || !quantity || !price || !date || !customer) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    connection.query(
        'INSERT INTO sales (product, quantity, price, date, customer) VALUES (?, ?, ?, ?, ?)',
        [product, quantity, price, date, customer],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Sale recorded successfully', saleId: result.insertId });
        }
    );
};

// GET ALL SALES
exports.getAllSales = (req, res) => {
    connection.query('SELECT * FROM sales', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// GET SINGLE SALE
exports.getSaleById = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM sales WHERE sID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Sale not found' });
        res.json(results[0]);
    });
};

// UPDATE SALE
exports.updateSale = (req, res) => {
    const { id } = req.params;
    const { product, quantity, price, date, customer } = req.body;

    connection.query(
        'UPDATE sales SET product = ?, quantity = ?, price = ?, date = ?, customer = ? WHERE sID = ?',
        [product, quantity, price, date, customer, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Sale not found' });
            res.json({ message: 'Sale updated successfully' });
        }
    );
};

// DELETE SALE
exports.deleteSale = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM sales WHERE sID = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Sale not found' });
        res.json({ message: 'Sale deleted successfully' });
    });
};