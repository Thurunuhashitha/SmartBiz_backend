const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// IMPORTANT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/product', productRoutes); 

const customerRoutes = require('./routes/customerRoutes');
app.use('/customer', customerRoutes); 

const supplierRoutes = require('./routes/supplierRoutes');
app.use('/supplier', supplierRoutes); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})