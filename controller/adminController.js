// adminController.js
const bcrypt = require('bcrypt');
const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// --- GET ALL COMPANIES ---
exports.getAllCompanies = (req, res) => {
    connection.query('SELECT id, company_name, owner, email, phone FROM company', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// --- GET COMPANY BY ID ---
exports.getCompanyById = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT id, company_name, owner, email, phone FROM company WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Company not found' });
        res.json(results[0]);
    });
};

// --- CREATE NEW COMPANY ---
exports.createCompany = async (req, res) => {
    const { company_name, owner, email, phone, password } = req.body;
    if (!company_name || !owner || !email || !phone || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
        'INSERT INTO company (company_name, owner, email, phone, password) VALUES (?, ?, ?, ?, ?)',
        [company_name, owner, email, phone, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Company created successfully', id: result.insertId });
        }
    );
};

// --- UPDATE COMPANY ---
exports.updateCompany = (req, res) => {
    const { id } = req.params;
    const { company_name, owner, email, phone } = req.body;

    connection.query(
        'UPDATE company SET company_name = ?, owner = ?, email = ?, phone = ? WHERE id = ?',
        [company_name, owner, email, phone, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Company not found' });
            res.json({ message: 'Company updated successfully' });
        }
    );
};

// --- DELETE COMPANY ---
exports.deleteCompany = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM company WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Company not found' });
        res.json({ message: 'Company deleted successfully' });
    });
};