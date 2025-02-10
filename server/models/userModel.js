const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        default: ''
    },
    banner: {  // ✅ New: Profile banner image
        type: String,
        default: ''
    },
    phoneNumber: String,
    profileCaption: {  // ✅ New: Short profile caption
        type: String,
        default: ''
    },
    otp: String,
    otpExpires: Date,
    googleId: {
        type: String,
        sparse: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
