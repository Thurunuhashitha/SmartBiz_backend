const bcrypt = require('bcrypt'); //https wenne ethakota
const jwt = require('jsonwebtoken');
const { getConnection } = require('../db/db-connection');
const connection = getConnection();

const JWT_SECRET = 'your_super_secret_key'; // store in env for production

// REGISTER 
exports.register = async (req, res) => {
    const { company_name, owner, email, phone, password } = req.body;

    if (!company_name || !owner || !email || !phone || !password) return res.status(400).json({ error: 'Username and password required' });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
        'INSERT INTO company (company_name, owner, email, phone, password) VALUES (?, ?, ?, ?, ?)',
        [company_name, owner, email, phone, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Company registered successfully' });
        }
    );
};

// LOGIN (Company + Hardcoded Admin)
exports.login = async (req, res) => {
    const { company_name, password } = req.body;

    if (!company_name || !password) 
        return res.status(400).json({ error: 'Company name and password required' });

    // --- HARD-CODED ADMIN LOGIN ---
    if (company_name === "admin@gmail.com" && password === "111111") { 
        return res.json({ message: "Admin login successful"});
    }

    // --- DATABASE COMPANY LOGIN ---
    connection.query(
        'SELECT * FROM company WHERE company_name = ?',
        [company_name],
        async (err, results) => {
            if (err) return res.status(500).json({ error: err });
            if (results.length === 0) return res.status(401).json({ error: 'Invalid company name' });

            const company = results[0];

            const match = await bcrypt.compare(password, company.password);
            if (!match) return res.status(401).json({ error: 'Invalid password' });

            // create JWT
            const token = jwt.sign(
                { id: company.id, company_name: company.company_name, role: "company" },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ message: 'Login successful', token });
        }
    );
};