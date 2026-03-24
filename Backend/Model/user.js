const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    },
    savedBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }],
    isBlocked: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("user", userSchema)