const express = require('express');
const cors = require('cors');
const bfhlRoutes = require('./routes/bfhl');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/bfhl', bfhlRoutes);

// Simple health check
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
