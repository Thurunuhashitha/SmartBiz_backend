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
    
    connection.query('SHOW TABLES', (err, results) => {
        if (err) console.error(err);
        console.log('Tables:', results);
        
        connection.query('SHOW TRIGGERS', (err, rows) => {
            if (err) console.error('Error fetching triggers:', err.message);
            else console.log('Triggers:', rows.map(r => r.Trigger));
            
            process.exit(0);
        });
    });
});
