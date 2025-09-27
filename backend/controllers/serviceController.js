const Service = require('../models/serviceModel');

// Create a new service
exports.createService = async (req, res) => {
  const { title, description, category, price, location, availableDates } = req.body;

  try {
    const newService = new Service({
        title,
        description,
        category,
        price,
        location,
        availableDates,
        createdBy: req.user.userId, 
      });
      

    await newService.save();
    res.status(201).json({ message: 'Service created successfully', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

// Search for services
exports.searchServices = async (req, res) => {
    const { category, location, priceRange } = req.query;
  
    const query = {};
  
    if (category) query.category = category;
    if (location) query.location = location;
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-');
      query.price = { $gte: minPrice, $lte: maxPrice };
    }
  
    try {
      const services = await Service.find(query);
      res.status(200).json({ services });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
  };
  