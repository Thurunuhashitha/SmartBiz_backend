require('dotenv').config();
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
const authRoutes = require('./routes/authRoutes')
app.use('/auth', authRoutes)

const customerRoutes = require('./routes/customerRoutes')
app.use('/customer', customerRoutes) 

const supplierRoutes = require('./routes/supplierRoutes')
app.use('/supplier', supplierRoutes)

const expenseRoutes = require('./routes/expensesRoutes')
app.use('/expense', expenseRoutes)

const adminRoutes = require('./routes/adminRoutes')
app.use('/admin', adminRoutes)

const productRoutes = require('./routes/productRoutes')
app.use('/product', productRoutes)

const aiRoutes = require("./routes/aiRoutes.js");
app.use("/ai", aiRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})