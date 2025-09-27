const express = require("express");
const router = express.Router();
const { getJobRequests, createJobRequest, acceptJob, declineJob } = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/jobs", authMiddleware, getJobRequests);
router.post("/bookings/:artisanId", authMiddleware, createJobRequest);
router.put("/jobs/:id/accept", authMiddleware, acceptJob);
router.put("/jobs/:id/decline", authMiddleware, declineJob);

module.exports = router;
