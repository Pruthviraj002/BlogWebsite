const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: "Admin Backend logic is running", db: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" });
});

app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.DB)
    .then(() => {
        console.log("Admin DB Connected Successfully");
        app.listen(PORT, () => {
            console.log(`Admin Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Admin DB Connection Error:", err.message);
    });
