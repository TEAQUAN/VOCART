// artisanRoutes.js
const express = require('express');
const {
  getAllArtisans,
  searchArtisans,
  filterArtisansBySkill,
  rateArtisan
} = require('../controllers/artisanController'); // Import controller functions

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get all artisans
router.get('/', getAllArtisans);

// Route to search artisans by name or skill
router.get('/artisans/search', searchArtisans);

// Route to filter artisans by skill
router.get('/artisans/filter', filterArtisansBySkill);

router.post("/:id/rate",authMiddleware, rateArtisan);


module.exports = router;
