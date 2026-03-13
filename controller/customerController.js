const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// CREATE CUSTOMER
exports.createCustomer = (req, res) => {
    const { customer_name, phone, email, product, quantity, unit_price } = req.body;
    const company_id = req.user.id;

    if (!customer_name || !phone || !email || !product || !quantity || !unit_price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    connection.query(
        'INSERT INTO customers (customer_name, phone, email, product, quantity, unit_price, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [customer_name, phone, email, product, quantity, unit_price, company_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Customer created successfully', customerId: result.insertId });
        }
    );
};

// GET ALL CUSTOMERS
exports.getAllCustomers = (req, res) => {
    const company_id = req.user.id;
    connection.query('SELECT * FROM customers WHERE company_id = ?', [company_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// GET SINGLE CUSTOMER
exports.getCustomerById = (req, res) => {
    const { id } = req.params;
    const company_id = req.user.id;

    connection.query(
        'SELECT * FROM customers WHERE cID = ? AND company_id = ?',
        [id, company_id],
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
    const { customer_name, phone, email, product, quantity, unit_price } = req.body;
    const company_id = req.user.id;

    connection.query(
        'UPDATE customers SET customer_name=?, phone=?, email=?, product=?, quantity=?, unit_price=? WHERE cID=? AND company_id=?',
        [customer_name, phone, email, product, quantity, unit_price, id, company_id],
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
    const company_id = req.user.id;

    console.log(`Attempting to delete customer ID: ${id}, company_id: ${company_id}`);

    connection.query(
        'DELETE FROM customers WHERE cID = ? AND company_id = ?',
        [id, company_id],
        (err, result) => {
            if (err) {
                console.error('Delete customer error:', err);
                return res.status(500).json({ error: err.message || 'Database error while deleting customer' });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });

            console.log(`Customer ID ${id} deleted successfully`);
            res.json({ message: 'Customer deleted successfully' });
        }
    );
};