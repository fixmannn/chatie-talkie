const express = require('express');
const router = express.Router();
const { dbConfig } = require('../config/database');

router.get('/', (req, res) => {
  res.json({
    status: 'Ok!',
    message: dbConfig
  });
});

module.exports = router;