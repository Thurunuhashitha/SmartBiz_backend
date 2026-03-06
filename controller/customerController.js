const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// CREATE CUSTOMER
exports.createCustomer = (req, res) => {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
        return res.status(400).json({ error: 'Name, phone, and email are required' });
    }

    connection.query(
        'INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Customer created successfully', customerId: result.insertId });
        }
    );
};

// GET ALL CUSTOMERS
exports.getAllCustomers = (req, res) => {
    connection.query('SELECT * FROM customers', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// GET SINGLE CUSTOMER
exports.getCustomerById = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM customers WHERE cID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json(results[0]);
    });
};

// UPDATE CUSTOMER
exports.updateCustomer = (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;

    connection.query(
        'UPDATE customers SET name = ?, phone = ?, email = ? WHERE cID = ?',
        [name, phone, email, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
            res.json({ message: 'Customer updated successfully' });
        }
    );
};

// DELETE CUSTOMER
exports.deleteCustomer = (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM customers WHERE cID = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    });
};