const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'CodeStories' },
    siteDescription: { type: String, default: 'Creative storytelling for the modern web.' },
    contactEmail: { type: String, default: 'admin@codestories.com' },
    maintenanceMode: { type: Boolean, default: false },
    allowRegistration: { type: Boolean, default: true },
    cloudinaryFolderName: { type: String, default: 'blog_images' },
    maxUploadSize: { type: Number, default: 5 }, // in MB
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
