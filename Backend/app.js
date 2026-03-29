const mongoose = require("mongoose")
const express = require("express")
const path = require("path")
const multer = require("multer")
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require("dotenv").config()
const BlogRoute = require("./Routes/blogRoute")
const UserRoute = require("./Routes/userRoute")
const AdminRoute = require("./Routes/adminRoute")
const ContactRoute = require("./Routes/contactRoute")
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// Security Middleware
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware');
const maintenanceMiddleware = require('./middleware/maintenanceMiddleware');

app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
}));
app.use(mongoSanitize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // Increased for active development
});
app.use('/api/', limiter);

// Stricter limiter for Auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // 10 attempts per 15 mins
    message: { errors: true, message: "Too many attempts from this IP, please try again after 15 minutes" }
});
app.use('/api/user/login', authLimiter);
app.use('/api/user/register', authLimiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer & Storage Setup
const localStore = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const cloudStore = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog-uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

// Use Cloudinary if credentials exist, otherwise local
const useCloud = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';
const upload = multer({ storage: useCloud ? cloudStore : localStore });

app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ errors: true, message: "No file uploaded" });
        
        let imageUrl = req.file.path;
        if (!useCloud) {
            const host = req.get('host');
            imageUrl = `http://${host}/uploads/${req.file.filename}`;
        }
        
        res.json({ errors: false, imageUrl });
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

// Primary Guard: Check for Maintenance BEFORE any api routes
app.use(maintenanceMiddleware);

app.use("/api/blog", BlogRoute)
app.use("/api/user", UserRoute)
app.use("/api/admin", AdminRoute)
app.use("/api/contact", ContactRoute)

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
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n!!! Port ${PORT} busy. Please close other terminals !!!\n`);
    }
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