const express = require('express');
const { createBooking, getUserBookings, getServiceProviderBookings, updateBookingStatus } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming authMiddleware exists

const router = express.Router();

// Route for creating a booking
router.post('/book', authMiddleware, createBooking);

// Route for getting all bookings of a user
router.get('/user', authMiddleware, getUserBookings);

// Route for getting all bookings of a service provider
router.get('/provider', authMiddleware, getServiceProviderBookings);

// Route for updating booking status
router.put('/status', authMiddleware, updateBookingStatus);

module.exports = router;
