const { getConnection } = require('../db/db-connection');
const connection = getConnection();

exports.getDashboardStats = (req, res) => {
    const company_id = req.user.id;
    const statsQuery = `
        SELECT 
            (SELECT COUNT(*) FROM customers WHERE company_id = ?) AS total_customers,
            (SELECT COUNT(*) FROM suppliers WHERE company_id = ?) AS total_suppliers,
            (SELECT COUNT(*) FROM expenses WHERE company_id = ?) AS total_expenses_count,
            (SELECT COUNT(*) FROM products WHERE company_id = ?) AS total_products,
            (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM customers WHERE company_id = ?) AS total_sales,
            (SELECT COALESCE(SUM(quantity * price), 0) FROM suppliers WHERE company_id = ?) AS total_supplier_costs,
            (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE company_id = ?) AS total_other_expenses
    `;

    connection.query(statsQuery, [company_id, company_id, company_id, company_id, company_id, company_id, company_id], (err, results) => {
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

exports.getSalesReport = (req, res) => {
    const company_id = req.user.id;
    const recentSalesQuery = `
        SELECT cID, customer_name, product, quantity, unit_price, sale_date 
        FROM customers 
        WHERE company_id = ?
        ORDER BY sale_date DESC 
        LIMIT 10
    `;

    const topProductsQuery = `
        SELECT product, SUM(quantity) as total_quantity, SUM(quantity * unit_price) as total_revenue
        FROM customers
        WHERE company_id = ?
        GROUP BY product
        ORDER BY total_revenue DESC
        LIMIT 5
    `;

    const monthlySalesQuery = `
        SELECT DATE_FORMAT(sale_date, '%Y-%m') as month, SUM(quantity * unit_price) as revenue
        FROM customers
        WHERE company_id = ? AND sale_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month ASC
    `;

    connection.query(recentSalesQuery, [company_id], (err, recentSales) => {
        if (err) return res.status(500).json({ error: err });
        
        connection.query(topProductsQuery, [company_id], (err, topProducts) => {
            if (err) return res.status(500).json({ error: err });

            connection.query(monthlySalesQuery, [company_id], (err, monthlySales) => {
                if (err) return res.status(500).json({ error: err });

                res.json({
                    recentSales,
                    topProducts,
                    monthlySales
                });
            });
        });
    });
};
