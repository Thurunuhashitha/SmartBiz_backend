const { getConnection } = require('../db/db-connection');
const connection = getConnection();

const loggerMiddleware = (req, res, next) => {
    // Log all non-GET requests to capture actions
    if (req.method !== 'GET') {
        try {
            const userId = req.user?.id || null;
            const companyId = req.user?.companyId || req.user?.id || req.body?.companyId || null;
            const action = `${req.method} ${req.originalUrl}`;
            const method = req.method;
            const path = req.originalUrl;
            const ipAddress = req.ip || req.socket?.remoteAddress || null;

            // Finish listener to capture status code
            res.on('finish', () => {
                const statusCode = res.statusCode;
                
                const query = 'INSERT INTO usage_logs (user_id, company_id, action, method, path, status_code, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)';
                connection.query(query, [userId, companyId, action, method, path, statusCode, ipAddress], (err) => {
                    if (err) {
                        console.error('Error saving usage log:', err.message);
                    }
                });
            });
        } catch (err) {
            console.error('Logger middleware error (non-blocking):', err.message);
        }
    }
    next();
};

module.exports = loggerMiddleware;
