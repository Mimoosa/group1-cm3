const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.post('/', (req, res) => {
  const { level, message, meta } = req.body;
  
  if (!level || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  logger[level](message, meta);
  res.status(200).json({ success: true });
});

module.exports = router;