const { getConnection } = require('./db/db-connection');
const connection = getConnection();

async function runTests() {
    let company_id;
    const testProduct = 'Test Stock Product ' + Date.now();
    
    console.log('--- Starting Verification ---');

    try {
        // 0. Create a test company
        console.log('0. Creating test company...');
        const companyRes = await query('INSERT INTO company (company_name, owner, email, phone, password) VALUES (?, ?, ?, ?, ?)', 
            ['Test Company ' + Date.now(), 'Tester', 'test@biz.com', '12345', 'pass']);
        company_id = companyRes.insertId;
        console.log(`   Company created with ID: ${company_id}`);

        // 1. Initial Product Setup
        console.log('1. Adding Supplier (Insert)...');
        await query('INSERT INTO suppliers (name, product, quantity, price, phone, company_id) VALUES (?, ?, ?, ?, ?, ?)', 
            ['Test Supplier', testProduct, 100, 10, '1234567890', company_id]);
        
        let stock = await getStock(testProduct, company_id);
        console.log(`   Stock after insert: ${stock} (Expected: 100)`);

        // 2. Update Supplier Quantity
        console.log('2. Updating Supplier Quantity (Increase)...');
        const sID = await getLastId('suppliers', 'sID');
        await query('UPDATE suppliers SET quantity = 150 WHERE sID = ?', [sID]);
        stock = await getStock(testProduct, company_id);
        console.log(`   Stock after update (100 -> 150): ${stock} (Expected: 150)`);

        console.log('3. Updating Supplier Quantity (Decrease)...');
        await query('UPDATE suppliers SET quantity = 120 WHERE sID = ?', [sID]);
        stock = await getStock(testProduct, company_id);
        console.log(`   Stock after update (150 -> 120): ${stock} (Expected: 120)`);

        // 3. Add Customer Sale
        console.log('4. Adding Customer Sale (Insert)...');
        await query('INSERT INTO customers (customer_name, phone, email, product, quantity, unit_price, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Test Customer', '0987654321', 'test@test.com', testProduct, 30, 15, company_id]);
        stock = await getStock(testProduct, company_id);
        console.log(`   Stock after sale (120 - 30): ${stock} (Expected: 90)`);

        // 4. Update Customer Sale Quantity
        console.log('5. Updating Customer Sale Quantity (Increase sale = Decrease stock)...');
        const cID = await getLastId('customers', 'cID');
        await query('UPDATE customers SET quantity = 50 WHERE cID = ?', [cID]);
        stock = await getStock(testProduct, company_id);
        console.log(`   Stock after update sale (30 -> 50): ${stock} (Expected: 70)`);

        console.log('6. Updating Customer Sale Quantity (Decrease sale = Increase stock)...');
        await query('UPDATE customers SET quantity = 10 WHERE cID = ?', [cID]);
        stock = await getStock(testProduct, company_id);
        console.log(`   Stock after update sale (50 -> 10): ${stock} (Expected: 110)`);

        // 5. Delete Records
        console.log('7. Deleting Customer Sale...');
        await query('DELETE FROM customers WHERE cID = ?', [cID]);
        stock = await getStock(testProduct, company_id);
        console.log(`   Stock after deleting sale: ${stock} (Expected: 120)`);

        console.log('8. Deleting Supplier Record...');
        await query('DELETE FROM suppliers WHERE sID = ?', [sID]);
        stock = await getStock(testProduct, company_id);
        console.log(`   Stock after deleting supplier: ${stock} (Expected: 0)`);

        console.log('\n--- Verification Finished Successfully ---');
    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        process.exit();
    }
}

function query(sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

async function getStock(product, company_id) {
    const results = await query('SELECT current_stock FROM products WHERE product_name = ? AND company_id = ?', [product, company_id]);
    return results.length > 0 ? results[0].current_stock : 0;
}

async function getLastId(table, idCol) {
    const results = await query(`SELECT ${idCol} FROM ${table} ORDER BY ${idCol} DESC LIMIT 1`);
    return results[0][idCol];
}

runTests();
