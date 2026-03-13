const { getConnection } = require('../db/db-connection');
const connection = getConnection();

// --- GET ALL PLANS (For users and admins) ---
exports.getAllPlans = (req, res) => {
    connection.query('SELECT * FROM plans WHERE is_active = TRUE', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// --- GET CURRENT PLAN FOR LOGGED IN COMPANY ---
exports.getCurrentPlan = (req, res) => {
    const company_id = req.user.id;

    connection.query(
        'SELECT plan_id FROM company WHERE id = ?',
        [company_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            if (results.length === 0) return res.status(404).json({ error: 'Company not found' });
            
            res.json({ plan_id: results[0].plan_id });
        }
    );
};

// --- ACTIVATE PLAN FOR A COMPANY ---
exports.activatePlan = (req, res) => {
    const { plan_id } = req.body;
    const company_id = req.user.id;

    if (!plan_id) return res.status(400).json({ error: 'Plan ID is required' });

    // Verify plan exists
    connection.query('SELECT * FROM plans WHERE id = ?', [plan_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Plan not found' });

        // Update company plan
        connection.query(
            'UPDATE company SET plan_id = ? WHERE id = ?',
            [plan_id, company_id],
            (err, result) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ message: 'Plan activated successfully' });
            }
        );
    });
};

// --- ADMIN: CREATE PLAN ---
exports.createPlan = (req, res) => {
    const { name, stock_limit_value, features } = req.body;
    if (!name) return res.status(400).json({ error: 'Plan name is required' });

    connection.query(
        'INSERT INTO plans (name, stock_limit_value, features) VALUES (?, ?, ?)',
        [name, stock_limit_value, features],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Plan created successfully', planId: result.insertId });
        }
    );
};

// --- ADMIN: UPDATE PLAN ---
exports.updatePlan = (req, res) => {
    const { id } = req.params;
    const { name, stock_limit_value, features, is_active } = req.body;

    connection.query(
        'UPDATE plans SET name = ?, stock_limit_value = ?, features = ?, is_active = ? WHERE id = ?',
        [name, stock_limit_value, features, is_active, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Plan not found' });
            res.json({ message: 'Plan updated successfully' });
        }
    );
};

// --- ADMIN: DELETE PLAN ---
exports.deletePlan = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM plans WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Plan not found' });
        res.json({ message: 'Plan deleted successfully' });
    });
};
