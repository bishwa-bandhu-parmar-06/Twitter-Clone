const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userAuth = require("../middleware/userAuth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // ✅ Allows image uploads


router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/send-otp", userController.sendOTP);   // Step 1: Generate and send OTP
router.post("/verify-otp", userController.verifyOTP); // Step 2: Verify OTP and login user


router.get("/get-users", userAuth, userController.getUsers);
router.get("/get-current-user", userAuth, async (req, res) => {
  try {
    // req.user is already populated by the userAuth middleware
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        avatar: req.user.avatar,
        profileCaption: req.user.profileCaption,  // ✅ Include profile caption
        banner: req.user.banner  // ✅ Include banner image
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
});
router.post("/logout", userController.logout);

router.post("/forgot-password", userController.sendResetOTP);  // Step 1: Send OTP to Email
router.post("/verify-reset-otp", userController.verifyResetOTP);      // Step 2: Verify OTP
router.post("/reset-password", userController.resetPassword);   // Step 3: Reset Password


router.post("/google-login", userController.googlelogin);

router.get('/validate-token', userAuth, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Token is valid',
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

router.post("/google-auth", userController.googleAuth);


// Profile-related routes
router.put("/update-profile", userAuth, upload.fields([{ name: "avatar" }, { name: "banner" }]), userController.updateProfile);

module.exports = router;
