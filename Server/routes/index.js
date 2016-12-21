'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/barcodes/pages/add');
});

module.exports = router;
