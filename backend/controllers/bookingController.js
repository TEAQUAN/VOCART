const Booking = require('../models/bookingModel');
const Service = require('../models/serviceModel');

// Create a new booking
exports.createBooking = async (req, res) => {
  const { serviceId, bookingDate, totalPrice } = req.body;
  
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const newBooking = new Booking({
      serviceId,
      userId: req.user._id,  // Assuming user is authenticated
      bookingDate,
      totalPrice,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('serviceId');
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get all bookings for a service provider
exports.getServiceProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 'serviceId.createdBy': req.user._id }).populate('userId serviceId');
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Update booking status (e.g., Confirmed, Completed)
exports.updateBookingStatus = async (req, res) => {
  const { bookingId, status } = req.body;

  if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};
