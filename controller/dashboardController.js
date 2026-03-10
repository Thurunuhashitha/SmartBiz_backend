const { getConnection } = require('../db/db-connection');
const connection = getConnection();

exports.getDashboardStats = (req, res) => {
    const statsQuery = `
        SELECT 
            (SELECT COUNT(*) FROM customers) AS total_customers,
            (SELECT COUNT(*) FROM suppliers) AS total_suppliers,
            (SELECT COUNT(*) FROM expenses) AS total_expenses_count,
            (SELECT COUNT(*) FROM products) AS total_products,
            (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM customers) AS total_sales,
            (SELECT COALESCE(SUM(quantity * price), 0) FROM suppliers) AS total_supplier_costs,
            (SELECT COALESCE(SUM(amount), 0) FROM expenses) AS total_other_expenses
    `;

    connection.query(statsQuery, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        
        const data = results[0];
        const revenue = parseFloat(data.total_sales);
        const supplierCosts = parseFloat(data.total_supplier_costs);
        const otherExpenses = parseFloat(data.total_other_expenses);
        const netProfit = revenue - (supplierCosts + otherExpenses);

        res.json({
            customers: data.total_customers,
            suppliers: data.total_suppliers,
            expensesCount: data.total_expenses_count,
            products: data.total_products,
            profitSummary: {
                revenue,
                supplierCosts,
                otherExpenses,
                netProfit
            }
        });
    });
};
