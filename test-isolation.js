const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function testIsolation() {
    try {
        console.log('--- Multi-tenant Data Isolation Test ---');

        // 1. Register and Login Company A
        console.log('Logging in Company A...');
        const loginA = await axios.post(`${API_URL}/auth/login`, {
            company_name: 'CompanyA', // Replace with an existing company for local test
            password: 'password123'
        });
        const tokenA = loginA.data.token;

        // 2. Register and Login Company B
        console.log('Logging in Company B...');
        const loginB = await axios.post(`${API_URL}/auth/login`, {
            company_name: 'CompanyB', // Replace with an existing company for local test
            password: 'password123'
        });
        const tokenB = loginB.data.token;

        // 3. Create a customer for Company A
        console.log('Creating customer for Company A...');
        const custA = await axios.post(`${API_URL}/customer/createCustomer`, {
            customer_name: 'Test Customer A',
            phone: '123',
            email: 'a@test.com',
            product: 'Product A',
            quantity: 1,
            unit_price: 100
        }, { headers: { Authorization: `Bearer ${tokenA}` } });
        const custAId = custA.data.customerId;

        // 4. Try to get Company A's customer using Company B's token
        console.log('Attempting to access Company A data with Company B token...');
        try {
            const forbiddenAccess = await axios.get(`${API_URL}/customer/getCustomerById/${custAId}`, {
                headers: { Authorization: `Bearer ${tokenB}` }
            });
            console.error('FAILED: Company B was able to access Company A data!');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('SUCCESS: Company B could not access Company A data (Returned 404).');
            } else {
                console.error('UNEXPECTED ERROR:', error.message);
            }
        }

        // 5. Get all customers for Company B
        console.log('Verifying Company B sees only its own data...');
        const allCustB = await axios.get(`${API_URL}/customer/getAllCustomers`, {
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        const foundAInB = allCustB.data.some(c => c.cID === custAId);
        if (foundAInB) {
            console.error('FAILED: Company A customer found in Company B list!');
        } else {
            console.log('SUCCESS: Company A customer NOT found in Company B list.');
        }

    } catch (error) {
        console.error('Test failed due to setup error:', error.response ? error.response.data : error.message);
        console.log('Note: Ensure server is running and companies "CompanyA" and "CompanyB" exist with password "password123".');
    }
}

testIsolation();
