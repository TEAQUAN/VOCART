const express = require('express');
const { registerUser, loginUser,getMe } = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register',upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.get("/me", authMiddleware, getMe); // Protected route

module.exports = router;
