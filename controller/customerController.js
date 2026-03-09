const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// CREATE CUSTOMER
exports.createCustomer = (req, res) => {
    const { customer_name, phone, email, product, quantity, unit_price, sale_date } = req.body;

    if (!customer_name || !phone || !email || !product || !quantity || !unit_price || !sale_date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    connection.query(
        'INSERT INTO customers (customer_name, phone, email, product, quantity, unit_price, sale_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [customer_name, phone, email, product, quantity, unit_price, sale_date],
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

    connection.query(
        'SELECT * FROM customers WHERE cID = ?',
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            if (results.length === 0) return res.status(404).json({ error: 'Customer not found' });

            res.json(results[0]);
        }
    );
};

// UPDATE CUSTOMER
exports.updateCustomer = (req, res) => {
    const { id } = req.params;
    const { customer_name, phone, email, product, quantity, unit_price, sale_date } = req.body;

    connection.query(
        'UPDATE customers SET customer_name=?, phone=?, email=?, product=?, quantity=?, unit_price=?, sale_date=? WHERE cID=?',
        [customer_name, phone, email, product, quantity, unit_price, sale_date, id],
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

    connection.query(
        'DELETE FROM customers WHERE cID = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });

            res.json({ message: 'Customer deleted successfully' });
        }
    );
};