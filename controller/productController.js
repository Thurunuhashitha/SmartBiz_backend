const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// CREATE PRODUCT
exports.createProduct = (req, res) => {
    const { product, price, stock, supplier, date_added } = req.body;

    if (!product || !price || !stock) {
        return res.status(400).json({ error: 'Product, price, and stock are required' });
    }

    connection.query(
        'INSERT INTO products (product, price, stock, supplier, date_added) VALUES (?, ?, ?, ?, ?)',
        [product, price, stock, supplier || null, date_added || null],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Product created successfully', productId: result.insertId });
        }
    );
};

// GET ALL PRODUCTS
exports.getAllProducts = (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// GET SINGLE PRODUCT
exports.getProductById = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM products WHERE pID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(results[0]);
    });
};

// UPDATE PRODUCT
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { product, price, stock, supplier, date_added } = req.body;

    connection.query(
        'UPDATE products SET product = ?, price = ?, stock = ?, supplier = ?, date_added = ? WHERE pID = ?',
        [product, price, stock, supplier, date_added, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product updated successfully' });
        }
    );
};

// DELETE PRODUCT
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM products WHERE pID = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    });
};