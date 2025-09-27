const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["artisan", "customer"], required: true }, // role field
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    skills: [{ type: String }], // Only for artisans
    profileImage: { type: String },

    // Ratings
    ratings: [
      {
        ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
      },
    ],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
