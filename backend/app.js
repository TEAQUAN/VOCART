const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require("./routes/bookingsRoutes")
const serviceRoutes = require("./routes/servicesRoutes")
const paymentRoutes = require('./routes/paymentRoutes');
const jobRoutes = require("./routes/jobRoutes");
const artisanRoutes = require("./routes/arTisanRoutes")
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json()); // Parse JSON bodies
dotenv.config({ path: './config/config.env' });


// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("Surrogate-Control", "no-store");
    next();
});

// Routes
app.use('/api/users',userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api", jobRoutes);
app.use("/api/artisans", artisanRoutes);

console.log(process.env.MONGO_URI)
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
