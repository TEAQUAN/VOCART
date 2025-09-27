const Job = require("../models/jobModel")


exports.getJobRequests = async (req, res) => {
    try {
        console.log("Authenticated User:", req.user); // Debugging

        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: "Artisan ID is required." });
        }

        const artisanId = req.user._id; // Use `_id`, not `userId`
        const jobs = await Job.find({ artisanId, status: "pending" });

        res.json(jobs);
    } catch (error) {
        console.error("Error fetching job requests:", error);
        res.status(500).json({ message: "Error fetching job requests" });
    }
};




exports.createJobRequest = async (req, res) => {
    try {
        console.log("Received body:", req.body);  // Log request body
        console.log("Received params:", req.params); // Log params

        const { clientName, title, description, location, budget, date, time } = req.body;
        const { artisanId } = req.params;

        if (!artisanId) {
            return res.status(400).json({ message: "Artisan ID is required." });
        }

        if (!clientName || !title || !description || !location || !budget || !date || !time) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const job = new Job({
            artisanId,
            clientName,
            title,
            description,
            location,
            budget,
            date,
            time
        });

        await job.save();
        res.status(201).json({ message: "Job request created successfully", job });
    } catch (error) {
        console.error("Error creating job request:", error);
        res.status(500).json({ message: "Error creating job request" });
    }
};




// Accept a job request
exports.acceptJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findByIdAndUpdate(jobId, { status: "accepted" }, { new: true });

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json({ message: "Job accepted", job });
    } catch (error) {
        res.status(500).json({ message: "Error accepting job request" });
    }
};

// Decline a job request
exports.declineJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findByIdAndUpdate(jobId, { status: "declined" }, { new: true });

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json({ message: "Job declined", job });
    } catch (error) {
        res.status(500).json({ message: "Error declining job request" });
    }
};