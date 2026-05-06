const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Lớp học số API' });
});

// Demo API for login/testing
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Placeholder logic
  res.json({ success: true, message: 'Login successful (Mock)' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
