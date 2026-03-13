const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// GET ALL PRODUCTS
exports.getAllProducts = (req, res) => {
    const company_id = req.user.id;
    connection.query('SELECT * FROM products WHERE company_id = ? ORDER BY product_name ASC', [company_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// GET AVAILABLE PRODUCTS (Stock > 0)
exports.getAvailableProducts = (req, res) => {
    const company_id = req.user.id;
    connection.query(
        'SELECT * FROM products WHERE company_id = ? AND current_stock > 0 ORDER BY product_name ASC',
        [company_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
};
