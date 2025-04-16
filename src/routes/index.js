const express = require('express');
const router = express.Router();
const ticketRoutes = require('./tickets');

// API routes
router.use('/tickets', ticketRoutes);

// Root route for API health check
router.get('/', (req, res) => {
  res.json({
    status: 'API is running',
    message: 'Welcome to the Lumber Sales API',
    version: '1.0.0'
  });
});

module.exports = router;