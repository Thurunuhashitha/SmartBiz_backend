const { getConnection } = require('../db/db-connection');
const connection = getConnection();

const loggerMiddleware = (req, res, next) => {
    // We only want to log non-GET requests for activity (mutations)
    // or specifically targeted routes if needed. 
    // For now, let's log all non-GET requests to capture actions.
    if (req.method !== 'GET') {
        const userId = req.user ? req.user.id : null; // Assuming req.user is populated by auth middleware
        const companyId = req.user ? req.user.companyId : (req.body.companyId || null);
        const action = `${req.method} ${req.originalUrl}`;
        const method = req.method;
        const path = req.originalUrl;
        const ipAddress = req.ip || req.connection.remoteAddress;

        // Finish listener to capture status code
        res.on('finish', () => {
            const statusCode = res.statusCode;
            
            const query = 'INSERT INTO usage_logs (user_id, company_id, action, method, path, status_code, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)';
            connection.query(query, [userId, companyId, action, method, path, statusCode, ipAddress], (err) => {
                if (err) {
                    console.error('Error saving usage log:', err);
                }
            });
        });
    }
    next();
};

module.exports = loggerMiddleware;
