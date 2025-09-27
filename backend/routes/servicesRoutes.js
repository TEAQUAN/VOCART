const express = require('express');
const { createService,searchServices } = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming authMiddleware exists

const router = express.Router();

// Route for posting a service
router.post('/', authMiddleware, createService);
// Route for searching services
router.get('/search', searchServices);


module.exports = router;
