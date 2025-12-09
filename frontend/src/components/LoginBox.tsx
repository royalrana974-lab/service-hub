"use client";

import { useState } from "react";
import { api } from "@/api";
import toast from "react-hot-toast";

export default function LoginBox() {
  const [activeTab, setActiveTab] = useState<"phone" | "email">("phone");
  const [isLoginMode, setIsLoginMode] = useState(false);

  // PHONE STATES
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // EMAIL STATES
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ERROR STATES
  const [errors, setErrors] = useState({
    phone: "",
    otp: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const clearErrors = () =>
    setErrors({
      phone: "",
      otp: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });

  // ---------------- SEND OTP ----------------
  const sendOtp = async () => {
    clearErrors();

    if (!phone.trim()) {
      setErrors((prev) => ({ ...prev, phone: "Phone number is required" }));
      return;
    }

    try {
      await api.post("/auth/phone/send-otp", {
        phoneNumber: "+91" + phone,
      });

      toast.success("OTP Sent Successfully!");
      setOtpSent(true);
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        phone: err.response?.data?.message || "Failed to send OTP",
      }));
    }
  };

  // ---------------- VERIFY OTP ----------------
  const verifyOtp = async () => {
    clearErrors();

    if (!otpSent) {
      setErrors((prev) => ({ ...prev, otp: "Please click SEND OTP first" }));
      return;
    }

    if (!otp.trim()) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }

    try {
      await api.post("/auth/phone/verify-otp", {
        phoneNumber: "+91" + phone,
        code: otp,
      });

      toast.success("OTP Verified Successfully!");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Invalid OTP";

      toast.error(errorMsg);

      setErrors((prev) => ({
        ...prev,
        otp: errorMsg,
      }));
    }
  };

  // ---------------- EMAIL REGISTER ----------------
  const registerEmail = async () => {
    clearErrors();

    let hasError = false;

    if (!firstName.trim()) {
      setErrors((prev) => ({ ...prev, firstName: "First name is required" }));
      hasError = true;
    }
    if (!lastName.trim()) {
      setErrors((prev) => ({ ...prev, lastName: "Last name is required" }));
      hasError = true;
    }
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      hasError = true;
    }
    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      hasError = true;
    }
    if (!confirmPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm password is required",
      }));
      hasError = true;
    }

    if (hasError) return;

    const fullName = `${firstName} ${lastName}`;

    try {
      await api.post("/auth/email/register", {
        fullName,
        email,
        password,
        confirmPassword,
      });

      toast.success("Registered Successfully!");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        email: err.response?.data?.message || "Registration failed",
      }));
    }
  };

  // ---------------- EMAIL LOGIN ----------------
  const loginEmail = async () => {
    clearErrors();

    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    try {
      await api.post("/auth/email/login", { email, password });

      toast.success("Login Successful!");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        email: err.response?.data?.message || "Login failed",
      }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 mb-8">
      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="px-8 py-10">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              JOIN SERVICEHUB
            </h2>
            <p className="text-sm text-gray-500">
              {activeTab === "phone" ? "Sign up with your phone number" : "Sign up with your email"}
            </p>
          </div>

          {/* TABS */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6 border border-gray-200">
            <button
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === "phone"
                  ? "bg-gradient-to-r from-gray-900 to-black text-white shadow-md transform scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => {
                setActiveTab("phone");
                setIsLoginMode(false);
                clearErrors();
              }}
            >
              PHONE
            </button>

            <button
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === "email"
                  ? "bg-gradient-to-r from-gray-900 to-black text-white shadow-md transform scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => {
                setActiveTab("email");
                setIsLoginMode(false);
                clearErrors();
              }}
            >
              EMAIL
            </button>
          </div>

      {/* ---------------- PHONE UI ---------------- */}
      {activeTab === "phone" && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PHONE NUMBER
            </label>
            <div className="flex items-center border-2 border-gray-200 rounded-xl w-full px-4 py-3 bg-white focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900 focus-within:ring-opacity-20 transition-all duration-200">
              <span className="mr-3 font-semibold text-gray-700 text-base">+91</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-base"
                maxLength={10}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span>⚠</span> {errors.phone}
              </p>
            )}
          </div>

          <button
            onClick={sendOtp}
            className="w-full bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
          >
            SEND OTP
          </button>

          {/* SHOW OTP FIELD ONLY AFTER SEND OTP */}
          {otpSent && (
            <div className="mt-6 animate-fadeIn">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                VERIFY OTP
              </label>
              <input
                type="text"
                value={otp}
                placeholder="Enter 6-digit OTP"
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-center text-2xl font-bold tracking-widest text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.otp}
                </p>
              )}

              <button
                onClick={verifyOtp}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 mt-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
              >
                VERIFY & CONTINUE
              </button>
            </div>
          )}

          <div className="flex items-center my-6">
            <span className="flex-grow border-t border-gray-200" />
            <span className="mx-4 text-sm text-gray-500 font-medium">OR</span>
            <span className="flex-grow border-t border-gray-200" />
          </div>

          <button
            onClick={() => (window.location.href = `${api.defaults.baseURL}/auth/google`)}
            className="w-full border-2 border-gray-200 rounded-xl py-3.5 flex items-center justify-center gap-3 font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            CONTINUE WITH GOOGLE
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-gray-900 font-semibold cursor-pointer hover:underline transition-all duration-200"
              onClick={() => {
                setActiveTab("email");
                setIsLoginMode(true);
                clearErrors();
              }}
            >
              Login
            </span>
          </p>

          <button className="w-full border-2 border-gray-200 rounded-xl py-3 mt-4 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 active:scale-95">
            Register as Provider
          </button>
        </>
      )}

      {/* ---------------- EMAIL UI ---------------- */}
      {activeTab === "email" && (
        <>
          {isLoginMode ? (
            <>
              {/* LOGIN */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PASSWORD
                </label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              <button
                onClick={loginEmail}
                className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
              >
                LOGIN
              </button>

              <p className="text-center mt-6 text-sm text-gray-600">
                Don't have an account?{" "}
                <span
                  className="text-gray-900 font-semibold cursor-pointer hover:underline transition-all duration-200"
                  onClick={() => {
                    setIsLoginMode(false);
                    clearErrors();
                  }}
                >
                  Register
                </span>
              </p>
            </>
          ) : (
            <>
              {/* REGISTER */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  FIRST NAME
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.firstName}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LAST NAME
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.lastName}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PASSWORD
                </label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠</span> {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                onClick={registerEmail}
                className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
              >
                REGISTER
              </button>

              <p className="text-center mt-6 text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  className="text-gray-900 font-semibold cursor-pointer hover:underline transition-all duration-200"
                  onClick={() => {
                    setIsLoginMode(true);
                    clearErrors();
                  }}
                >
                  Login
                </span>
              </p>
            </>
          )}
        </>
      )}
        </div>
      </div>
    </div>
  );
}
