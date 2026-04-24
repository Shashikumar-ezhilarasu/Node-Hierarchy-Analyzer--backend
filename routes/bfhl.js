const express = require('express');
const router = express.Router();
const bfhlController = require('../controllers/bfhlController');

// POST /bfhl
router.post('/', bfhlController.processGraphData);

// GET /bfhl (Optional)
router.get('/', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

module.exports = router;
