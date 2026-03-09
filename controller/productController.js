const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// GET ALL PRODUCTS
exports.getAllProducts = (req, res) => {
    connection.query('SELECT * FROM products ORDER BY product_name ASC', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};
