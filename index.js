const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes); 

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

