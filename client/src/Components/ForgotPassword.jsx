import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Reset Password
  const navigate = useNavigate();
  const backendUri = import.meta.env.VITE_BACKEND_URI;

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter your registered email.");
      return;
    }

    try {
      const response = await axios.post(`${backendUri}/api/users/forgot-password`, { email });
      if (response.data.success) {
        toast.success("OTP sent to your email.");
        setStep(2); // Move to OTP verification step
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post(`${backendUri}/api/users/verify-reset-otp`, { email, otp });
      if (response.data.success) {
        toast.success("OTP verified. You can now reset your password.");
        setStep(3); // Move to reset password step
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    try {
      const response = await axios.post(`${backendUri}/api/users/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password reset successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Forgot Password
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={handleSendOTP}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-all"
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-all"
            >
              Reset Password
            </button>
          </>
        )}

        <div className="text-center text-gray-600 mt-4">
          <button onClick={() => navigate("/login")} className="text-blue-500 hover:underline">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;