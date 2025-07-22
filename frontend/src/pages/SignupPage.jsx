import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  MessageCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { useAuthStore } from "../store/useAuthStore";

// Geometric Illustration Component
const GeometricIllustration = () => {
  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Main Chat Bubble */}
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-purple-500/30 flex items-center justify-center animate-float">
          <MessageCircle className="w-16 h-16 text-purple-400" />
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-blue-500/30 to-teal-500/30 rounded-full backdrop-blur-sm border border-blue-500/30 animate-float-delayed"></div>
        <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-teal-500/30 to-purple-500/30 rounded-lg backdrop-blur-sm border border-teal-500/30 animate-float-slow"></div>
        <div className="absolute top-1/2 -left-12 w-8 h-8 bg-gradient-to-r from-purple-500/40 to-pink-500/40 rounded-full backdrop-blur-sm border border-purple-500/40 animate-bounce"></div>
        <div className="absolute -top-4 left-1/2 w-6 h-6 bg-gradient-to-r from-pink-500/40 to-blue-500/40 rounded-full backdrop-blur-sm border border-pink-500/40 animate-pulse"></div>
        <div className="absolute bottom-1/2 -right-16 w-10 h-10 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg backdrop-blur-sm border border-blue-500/30 animate-float-reverse"></div>
      </div>

      {/* Connecting Lines */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent absolute top-0 left-8 animate-pulse"></div>
        <div className="w-0.5 h-24 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent absolute top-8 left-0 animate-pulse"></div>
      </div>

      {/* Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  error,
  name,
  showPassword,
  togglePassword,
  autoComplete,
  required,
}) => {
  return (
    <div className="relative group mb-2">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center h-14 pointer-events-none z-10">
        <Icon className="h-5 w-5 text-purple-400 transition-colors duration-200" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full pl-14 pr-12 h-14 bg-gray-800/60 border ${
          error ? "border-red-500/50" : "border-gray-700/50"
        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm hover:bg-gray-800/80`}
      />
      {name === "password" && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute inset-y-0 right-0 pr-4 h-14 flex items-center justify-center"
          tabIndex={0}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 mx-auto my-auto text-purple-400 hover:text-purple-300 transition-colors duration-200" />
          ) : (
            <Eye className="h-5 w-5 mx-auto my-auto text-purple-400 hover:text-purple-300 transition-colors duration-200" />
          )}
        </button>
      )}
      {/* Reserve space for error message to prevent layout shift */}
      <div style={{ minHeight: "24px" }}>
        {error && (
          <div
            className="flex items-center mt-2 text-red-400 text-sm"
            id={`${name}-error`}
          >
            <XCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

// Main SignupPage Component
const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock auth store - replace with your actual useAuthStore
  const { isSigningUp, signup } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = "Full name must be at least 2 characters";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9_.]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }
    setIsLoading(true);
    try {
      await signup(formData);
      toast.success("Account created successfully! You can now login");
      setFormData({
        username: "",
        email: "",
        password: "",
        fullname: "",
      });
      window.location.href = "/login"; // Replace with your routing logic
    } catch (error) {
      toast.error(
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation for Sign In button
  const handleSignIn = (e) => {
    e.preventDefault();
    window.location.href = "/login";
  };

  return (
    <div className="h-screen bg-gray-900 relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"></div>
      <div className="relative z-10 h-full grid lg:grid-cols-2 grid-cols-1">
        {/* Left Column - Geometric Illustration */}
        <div className="hidden lg:flex items-center justify-center bg-gray-800/20 backdrop-blur-sm">
          <GeometricIllustration />
        </div>
        {/* Right Column - Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-3">
                Create Account
              </h1>
              <p className="text-gray-400">Join the conversation</p>
            </div>
            {/* Form */}
            <form
              className="space-y-6"
              onSubmit={handleSubmit}
              autoComplete="on"
              noValidate
            >
              <InputField
                icon={User}
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleInputChange}
                error={errors.fullname}
                autoComplete="name"
                required
              />
              <InputField
                icon={User}
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                autoComplete="username"
                required
              />
              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                autoComplete="email"
                required
              />
              <InputField
                icon={Lock}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
                autoComplete="new-password"
                required
              />
              {/* Reserve space for error messages to prevent layout shift */}
              <div style={{ minHeight: "24px" }}></div>
              <button
                type="submit"
                disabled={isLoading || isSigningUp}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/25 min-h-[56px]"
                aria-busy={isLoading || isSigningUp}
                aria-disabled={isLoading || isSigningUp}
              >
                <span className="flex items-center justify-center w-full">
                  {isLoading || isSigningUp ? (
                    <>
                      <span className="inline-block mr-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Create Account</span>
                    </>
                  )}
                </span>
              </button>
            </form>
            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <button
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline"
                  onClick={handleSignIn}
                  tabIndex={0}
                  type="button"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1F2937",
            color: "#F9FAFB",
            border: "1px solid #374151",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#F9FAFB",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#F9FAFB",
            },
          },
        }}
      />
    </div>
  );
};

export default SignupPage;
