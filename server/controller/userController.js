const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const transporter = require('../database/nodemailer');


module.exports.register = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({success: true, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            username,
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // sending email verification otp
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Email Verification',
            text: `Welcome to Twitter Clone website Made By Bishwa Bandhu Parmar. Your account has been created with the email ID:  ${email}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({success: true, message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Compare hashed passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Store Token in HTTP-only Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

         // Send Email Notification (✅ Ensuring it's after a successful login)
         const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Login Alert: Your Account Accessed",
            text: `Hello ${user.name},\n\nYou have successfully logged into your account on Twitter Clone.\n\nIf this wasn't you, please reset your password immediately.\n\nRegards,\nTwitter Clone Team`,
        };

        await transporter.sendMail(mailOptions); 

        // Send Response with Token (🔹 This was missing before!)
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,  // ✅ Now returning token
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Function to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Step 1: Send OTP
module.exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP via Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Your Login OTP",
            text: `Your OTP for login is: ${otp}. This OTP is valid for 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Step 2: Verify OTP and Login
module.exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Clear OTP after verification
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Login Successful",
            text: `Welcome to Twitter Clone website Made By Bishwa Bandhu Parmar. Your account has been Login with the email ID:  ${email}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports.getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({ success: true, users });  // ✅ Return users inside an object
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};





// ✅ Step 1: Send Reset OTP if Email Exists
module.exports.sendResetOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Email not registered" });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP via Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "OTP sent successfully to your email." });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Step 2: Verify OTP
module.exports.verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        res.json({ success: true, message: "OTP verified successfully. You can now reset your password." });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Step 3: Reset Password
module.exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || user.otp !== otp || new Date() > user.otpExpires) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // Send OTP via Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Password Reset Successfully",
            text: `Your password has been reset successfully for the email ID: ${email}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Password reset successfully." });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true, // Ensures the cookie is only accessible by the server
            secure: process.env.NODE_ENV === 'production', // Secure in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).json({ success: true, message: 'User logged out successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Google Login

module.exports.googlelogin = async (req, res) => {
    try {
        const { name, email, phoneNumber, avatar } = req.body;

        let user = await userModel.findOne({ email });

        if (!user) {
            const generatedUsername = email.split("@")[0];
            const defaultPassword = Math.random().toString(36).slice(-8);

            user = new userModel({
                name,
                email,
                phoneNumber,
                avatar,
                username: generatedUsername,
                password: defaultPassword,
            });

            await user.save();
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("access_token", token, { httpOnly: true });

        res.status(200).json({
            success: true,
            message: "Logged in successfully!",
            user,
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


module.exports.getcurrentuser =  async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};