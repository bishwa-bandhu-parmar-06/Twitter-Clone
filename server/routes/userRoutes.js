const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userAuth = require("../middleware/userAuth");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/send-otp", userController.sendOTP);   // Step 1: Generate and send OTP
router.post("/verify-otp", userController.verifyOTP); // Step 2: Verify OTP and login user


router.get("/get-users", userAuth, userController.getUsers);
router.get("/get-current-user", userAuth, userController.getcurrentuser);
router.post("/logout", userController.logout);

router.post("/forgot-password", userController.sendResetOTP);  // Step 1: Send OTP to Email
router.post("/verify-reset-otp", userController.verifyResetOTP);      // Step 2: Verify OTP
router.post("/reset-password", userController.resetPassword);   // Step 3: Reset Password


router.post("/google-login", userController.googlelogin);
module.exports = router;
