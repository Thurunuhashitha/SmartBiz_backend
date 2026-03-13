const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// CREATE SUPPLIER
exports.createSupplier = (req, res) => {
    const { name, product, quantity, price, phone } = req.body;
    const company_id = req.user.id;

    if (!name || !product || !quantity || !price || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // 1. Get company plan and stock limit
    const planQuery = `
        SELECT p.stock_limit_value 
        FROM company c 
        JOIN plans p ON c.plan_id = p.id 
        WHERE c.id = ?`;

    connection.query(planQuery, [company_id], (err, planResults) => {
        if (err) return res.status(500).json({ error: err });
        if (planResults.length === 0) return res.status(404).json({ error: 'Company or plan not found' });

        const limit = planResults[0].stock_limit_value;

        // If limit is NULL (Prime Plan), skip check
        if (limit === null) {
            return insertSupplier();
        }

        // 2. Calculate current total stock value
        const currentStockValueQuery = 'SELECT SUM(current_stock * unit_price) AS total_value FROM products WHERE company_id = ?';
        connection.query(currentStockValueQuery, [company_id], (err, stockResults) => {
            if (err) return res.status(500).json({ error: err });

            const currentTotal = stockResults[0].total_value || 0;
            const newValue = quantity * price;

            if (currentTotal + newValue > limit) {
                return res.status(403).json({
                    error: 'Stock limit exceeded',
                    limit: limit,
                    currentTotal: currentTotal,
                    additionalValue: newValue,
                    message: `Adding this stock would exceed your plan's limit of ${limit}. Please upgrade your plan.`
                });
            }

            insertSupplier();
        });
    });

    function insertSupplier() {
        connection.query(
            'INSERT INTO suppliers (name, product, quantity, price, phone, company_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, product, quantity, price, phone, company_id],
            (err, result) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ message: 'Supplier created successfully', supplierId: result.insertId });
            }
        );
    }
};

// GET ALL SUPPLIERS
exports.getAllSuppliers = (req, res) => {
    const company_id = req.user.id;
    connection.query('SELECT * FROM suppliers WHERE company_id = ?', [company_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// GET SINGLE SUPPLIER
exports.getSupplierById = (req, res) => {
    const { id } = req.params;
    const company_id = req.user.id;

    connection.query(
        'SELECT * FROM suppliers WHERE sID = ? AND company_id = ?',
        [id, company_id],
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
    const company_id = req.user.id;

    connection.query(
        'UPDATE suppliers SET name=?, product=?, quantity=?, price=?, phone=?  WHERE sID=? AND company_id=?',
        [name, product, quantity, price, phone,  id, company_id],
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
    const company_id = req.user.id;

    console.log(`Attempting to delete supplier ID: ${id}, company_id: ${company_id}`);

    connection.query(
        'DELETE FROM suppliers WHERE sID = ? AND company_id = ?',
        [id, company_id],
        (err, result) => {
            if (err) {
                console.error('Delete supplier error:', err);
                return res.status(500).json({ error: err.message || 'Database error while deleting supplier' });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Supplier not found' });

            console.log(`Supplier ID ${id} deleted successfully`);
            res.json({ message: 'Supplier deleted successfully' });
        }
    );
};