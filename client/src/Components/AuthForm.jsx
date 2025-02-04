import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons
import { auth, provider } from "../utils/GoogleLogin"
import { signInWithPopup } from 'firebase/auth';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const backendUri = import.meta.env.VITE_BACKEND_URI;

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
  
    let url = isLogin
      ? `${backendUri}/api/users/login`
      : `${backendUri}/api/users/register`;
  
    if (isOtpLogin && otpSent) {
      url = `${backendUri}/api/users/verify-otp`;
    }
  
    try {
      const response = await axios.post(
        url,
        isOtpLogin && otpSent
          ? { email: userData.email, otp }
          : userData,
        { withCredentials: true }
      );
  
      toast.success(response.data.message || "Success! Redirecting...");
  
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      }
  
      setTimeout(() => navigate("/dashboard"), 100);
      toast.error(response.data.message || "Authentication failed.");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong. Please try again.");
    }
  };

  const handleOtpRequest = async () => {
    if (!userData.email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(`${backendUri}/api/users/send-otp`, { email: userData.email });

      if (response.data.success) {
        toast.success("OTP sent to your email.");
        setOtpSent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP.");
    }
  };

  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
  
      const userData = {
        name: user.displayName || "No Name",
        email: user.email,
        avatar: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
      };
  
      const apiResponse = await fetch(`${backendUri}/api/users/google-login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const data = await apiResponse.json();
  
      if (!apiResponse.ok) {
        throw new Error(data.message || "Failed to login");
      }
  
      if (data.success) {
        toast.success(data.message);
  
        localStorage.setItem("authToken", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Google sign-in was closed. Try again.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };
  
  
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          {isLogin ? "Login" : "Create an Account"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <input type="text" name="name" value={userData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="Full Name" />
              <input type="text" name="username" value={userData.username} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="Username" />
            </>
          )}
          <input type="email" name="email" value={userData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="Email" />

          {isLogin && isOtpLogin ? (
            otpSent ? (
              <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" placeholder="Enter OTP" />
            ) : (
              <button type="button" onClick={handleOtpRequest} className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg">
                Send OTP
              </button>
            )
          ) : (
            <input type="password" name="password" value={userData.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="Password" />
          )}

          {!isOtpLogin || otpSent ? (
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg">
              {isOtpLogin && isLogin ? "Verify OTP" : isLogin ? "Login" : "Register"}
            </button>
          ) : null}
        </form>

        <div className="text-center text-gray-600 mt-4">
          {isLogin ? (
            <>
              <p>
                Don't have an account? <button onClick={() => { setIsLogin(false); setIsOtpLogin(false); }} className="text-blue-500 hover:underline">Create Account</button>
              </p>
              <p>
                <button onClick={() => setIsOtpLogin(!isOtpLogin)} className="text-green-500 hover:underline">
                  {isOtpLogin ? "Login with Password" : "Login with OTP"}
                </button>
              </p>
              <p>
                <button onClick={() => navigate("/forgot-password")} className="text-red-500 hover:underline">
                  Forgot Password?
                </button>
              </p>
            </>
          ) : (
            <p>
              Already have an account? <button onClick={() => setIsLogin(true)} className="text-blue-500 hover:underline">Login</button>
            </p>
          )}
        </div>

        {/* Google Auth Button */}
        <div className="mt-6 text-center">
        <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-lg py-2 font-medium shadow-md hover:bg-gray-100 transition-all"
          >
            <FcGoogle className="text-2xl" /> 
            {isLogin ? "Sign in with Google" : "Sign up with Google"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
