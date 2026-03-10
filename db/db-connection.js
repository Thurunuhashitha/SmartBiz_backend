const mysql = require('mysql2');

let connection;

function getConnection() {
    if (!connection) {
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '2000kgT.',
            database: 'smartBiznew'
        });

        connection.connect(err => {
            if (err) {
                console.error('DB connection failed:', err);
            } else {
                console.log('MySQL Connected');
            }
        });
    }

    return connection; // always return it
}

module.exports = { getConnection };
