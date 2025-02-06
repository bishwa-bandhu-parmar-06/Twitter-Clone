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
        index: true  // ✅ Improves lookup performance
    },
    password: {
        type: String,
        required: false, // ✅ Optional for OAuth users
    },
    avatar: {
        type: String,
        default: ''
    },
    phoneNumber: String, // ✅ Stores Google phone number
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
}, { timestamps: true });  // ✅ Adds createdAt & updatedAt fields automatically

const User = mongoose.model('User', userSchema);

module.exports = User;
