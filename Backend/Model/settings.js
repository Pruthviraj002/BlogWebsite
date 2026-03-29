const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'CodeStories' },
    siteDescription: { type: String, default: 'Creative storytelling for the modern web.' },
    maintenanceMode: { type: Boolean, default: false },
    allowRegistration: { type: Boolean, default: true },
    cloudinaryFolderName: { type: String, default: 'blog-uploads' },
}, { timestamps: true });

module.exports = mongoose.model('settings', settingsSchema);
