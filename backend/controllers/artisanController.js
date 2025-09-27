// artisanController.js
const User = require('../models/user'); // Assuming User model is used for artisans

// Get all artisans
const getAllArtisans = async (req, res) => {
  try {
      const artisans = await User.find({ role: "artisan" }).select("name location skills profileImage ratings averageRating");
      console.log("📢 Sending artisans data:", artisans); // Debugging
      res.status(200).json(artisans);
  } catch (error) {
      res.status(500).json({ message: "Error fetching artisans" });
  }
};

// Search artisans by name or skill
const searchArtisans = async (req, res) => {
  const { query } = req.query;

  try {
    const artisans = await User.find({
      role: 'artisan',
      $or: [
        { name: { $regex: query, $options: 'i' } }, 
        { skills: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json(artisans);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

// Filter artisans by skill
const filterArtisansBySkill = async (req, res) => {
  const { skill } = req.query;

  try {
    const artisans = await User.find({
      role: 'artisan',
      skills: { $in: [skill] },
    });

    res.status(200).json(artisans);
  } catch (err) {
    res.status(500).json({ message: 'Filter failed', error: err.message });
  }
};

const rateArtisan = async (req, res) => {
  console.log("🔥 rateArtisan function called!");

  try {
    const { rating } = req.body;
    console.log("req.user:", req.user); // Check if req.user is populated

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }

    const ratedBy = req.user._id.toString();
    console.log("Rated by user ID:", ratedBy);

    const artisan = await User.findOne({ _id: req.params.id, role: "artisan" });

    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    // Ensure rating is within 1-5
    const parsedRating = parseFloat(rating);
    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Ensure user is not rating themselves
    if (ratedBy === artisan._id.toString()) {
      return res.status(400).json({ message: "You cannot rate yourself" });
    }

    // Initialize ratings array if not present
    if (!artisan.ratings) {
      artisan.ratings = [];
    }

    // Check if user has already rated
    const existingRating = artisan.ratings.find(r => r.ratedBy.toString() === ratedBy);
    if (existingRating) {
      existingRating.rating = parsedRating;
    } else {
      artisan.ratings.push({ ratedBy, rating: parsedRating });
    }

    // Recalculate average rating
    const totalRatings = artisan.ratings.length;
    const sumRatings = artisan.ratings.reduce((sum, r) => sum + r.rating, 0);
    artisan.averageRating = sumRatings / totalRatings;

    await artisan.save();

    res.json({
      message: "Rating submitted successfully",
      averageRating: artisan.averageRating,
      totalRatings: totalRatings,
      artisan
    });

  } catch (error) {
    console.error("❌ Error in rateArtisan:", error);
    res.status(500).json({ message: "Error submitting rating" });
  }
};




module.exports = {
  getAllArtisans,
  searchArtisans,
  filterArtisansBySkill,
  rateArtisan
};
