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
        unique: true
    },
    password: {
        type: String,
        required: false, // ✅ Password is now optional for Google login users
    },
    avatar: String,  // ✅ Added to store Google profile picture
    phoneNumber: String, // ✅ Added to store Google phone number (if available)
    otp: String, 
    otpExpires: Date 
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
