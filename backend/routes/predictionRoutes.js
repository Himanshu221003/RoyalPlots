const express = require('express');
const router = express.Router();
const { predictPrice } = require('../controllers/predictionController');

router.post('/', predictPrice);

module.exports = router;
