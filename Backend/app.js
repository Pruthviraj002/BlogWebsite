const mongoose = require("mongoose")
const express = require("express")
const path = require("path")
const multer = require("multer")
require("dotenv").config()
const BlogRoute = require("./Routes/blogRoute")
const UserRoute = require("./Routes/userRoute")
const AdminRoute = require("./Routes/adminRoute")
const cors = require('cors')

const app = express()

// Security Middleware
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware');

app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
        res.json({ errors: false, imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
    } catch (error) {
        res.status(500).json({ errors: true, message: error.message });
    }
});

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Welcome to my blog")
})

app.get("/health", (req, res) => {
    res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.use("/api/blog", BlogRoute)
app.use("/api/user", UserRoute)
app.use("/api/admin", AdminRoute)

// Global Error Handler
app.use(errorHandler);

// Fallback for 404
app.use((req, res) => {
    console.log(`404 - Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ errors: true, message: `Route ${req.url} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

async function DB() {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database Connection Error:", error.message);
    }
}

DB()