const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2000kgT.',
    database: 'smartBiznew'
});

connection.connect((err) => {
    if (err) {
        console.error('DB connection failed:', err);
        process.exit(1);
    }
    console.log('MySQL Connected');
    
    // Check if products table is empty
    connection.query('SELECT COUNT(*) as count FROM products', (err, results) => {
        if (err) throw err;
        
        if (results[0].count === 0) {
            console.log('Products table is empty. Migrating existing data...');
            const sql = `
                INSERT INTO products (product_name, current_stock, unit_price)
                SELECT 
                    s.product,
                    (SUM(s.quantity) - COALESCE((SELECT SUM(quantity) FROM customers c WHERE c.product = s.product), 0)) as current_stock,
                    MAX(s.price) as unit_price
                FROM suppliers s
                GROUP BY s.product
            `;
            
            connection.query(sql, (err, res) => {
                if (err) {
                    console.error('Migration failed:', err);
                } else {
                    console.log('Migration successful!', res.affectedRows, 'products inserted.');
                }
                process.exit(0);
            });
        } else {
            console.log('Products table already has data. Count:', results[0].count);
            process.exit(0);
        }
    });
});
