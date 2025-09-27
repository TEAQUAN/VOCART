const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning'],  // Example categories
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String, // Can be city, town, etc.
    required: true,
  },
  availableDates: {
    type: [Date],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
