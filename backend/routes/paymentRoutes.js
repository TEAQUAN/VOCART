const express = require('express');
const { makePayment } = require('../controllers/paymentController');

const router = express.Router();

router.post('/pay', makePayment);

module.exports = router;
