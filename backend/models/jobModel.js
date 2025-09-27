const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clientName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },  // Optional description
    location: { type: String, required: true },
    budget: { type: Number, required: true },
    date: { type: String, required: true },  // Store date as string (YYYY-MM-DD)
    time: { type: String, required: true },  // Store time as string (HH:mm)
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
