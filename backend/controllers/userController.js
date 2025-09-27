const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Store in memory for testing



 exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, bio, skills } = req.body;
    let profileImage = req.file ? req.file.path : null; // Handle optional image upload

    // 🔹 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // 🔹 Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔹 Create new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      location,
      bio,
      skills,
      profileImage,
    });

    // 🔹 Save to database
    await newUser.save();

    console.log("✅ User saved:", newUser); // Debugging log

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT Token with relevant fields
      const token = jwt.sign(
        {
            userId: user._id,
            name: user.name, // Add full name
            email: user.email,
            role: user.role,
            profileImage: user.profileImage || null
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
      console.log(token)
  
      // Send token and user data (without password) in the response
      res.json({
        message: 'Login successful',
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        }
        
      });
      console.log(user.role)
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  };

  exports.getMe = async (req, res) => {
    try {
      const user = req.user; // User is already attached from middleware

      res.status(200).json({
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage || null,
          location: user.location || "Not provided",
          skills: user.skills || [],
      });
  } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};
