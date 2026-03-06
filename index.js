const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// IMPORTANT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})