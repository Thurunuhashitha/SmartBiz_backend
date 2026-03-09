const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// CREATE SUPPLIER
exports.createSupplier = (req, res) => {
    const { name, product, quantity, price, phone  } = req.body;

    if (!name || !product || !quantity || !price || !phone  ) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    connection.query(
        'INSERT INTO suppliers (name, product, quantity, price, phone ) VALUES (  ?, ?, ?, ?, ?)',
        [name, product, quantity, price, phone ],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Supplier created successfully', supplierId: result.insertId });
        }
    );
};

// GET ALL SUPPLIERS
exports.getAllSuppliers = (req, res) => {
    connection.query('SELECT * FROM suppliers', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// GET SINGLE SUPPLIER
exports.getSupplierById = (req, res) => {
    const { id } = req.params;

    connection.query(
        'SELECT * FROM suppliers WHERE sID = ?',
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            if (results.length === 0) return res.status(404).json({ error: 'Supplier not found' });

            res.json(results[0]);
        }
    );
};

// UPDATE SUPPLIER
exports.updateSupplier = (req, res) => {
    const { id } = req.params;
    const { name, product, quantity, price, phone  } = req.body;

    connection.query(
        'UPDATE suppliers SET name=?, product=?, quantity=?, price=?, phone=?  WHERE sID=?',
        [name, product, quantity, price, phone,  id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Supplier not found' });

            res.json({ message: 'Supplier updated successfully' });
        }
    );
};

// DELETE SUPPLIER
exports.deleteSupplier = (req, res) => {
    const { id } = req.params;

    connection.query(
        'DELETE FROM suppliers WHERE sID = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Supplier not found' });

            res.json({ message: 'Supplier deleted successfully' });
        }
    );
};