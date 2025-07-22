import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  MessageCircle,
  LogIn,
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
        <div className="w-36 h-36 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-blue-500/30 flex items-center justify-center animate-float">
          <MessageCircle className="w-18 h-18 text-blue-400" />
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute -top-6 -right-10 w-14 h-14 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full backdrop-blur-sm border border-purple-500/30 animate-float-delayed"></div>
        <div className="absolute -bottom-8 -left-8 w-10 h-10 bg-gradient-to-r from-pink-500/30 to-blue-500/30 rounded-lg backdrop-blur-sm border border-pink-500/30 animate-float-slow"></div>
        <div className="absolute top-1/3 -left-14 w-6 h-6 bg-gradient-to-r from-blue-500/40 to-teal-500/40 rounded-full backdrop-blur-sm border border-blue-500/40 animate-bounce"></div>
        <div className="absolute -top-2 left-1/3 w-8 h-8 bg-gradient-to-r from-teal-500/40 to-purple-500/40 rounded-full backdrop-blur-sm border border-teal-500/40 animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-12 w-12 h-12 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-xl backdrop-blur-sm border border-purple-500/30 animate-float-reverse"></div>

        {/* Additional decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-full backdrop-blur-sm animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-gradient-to-r from-purple-400/50 to-pink-400/50 rounded-full backdrop-blur-sm animate-pulse delay-1000"></div>
      </div>

      {/* Connecting Lines */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent absolute top-0 left-10 animate-pulse"></div>
        <div className="w-0.5 h-28 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent absolute top-10 left-0 animate-pulse delay-500"></div>
      </div>

      {/* Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
  disabled,
  autoComplete,
  required,
}) => {
  return (
    <div className="relative group mb-2">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center h-14 pointer-events-none z-10">
        <Icon
          className={`h-5 w-5 transition-colors duration-200 text-blue-400`}
        />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full pl-14 pr-12 h-14 bg-gray-800/60 border ${
          error ? "border-red-500/50" : "border-gray-700/50"
        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm hover:bg-gray-800/80 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />
      {name === "password" && (
        <button
          type="button"
          onClick={togglePassword}
          disabled={disabled}
          className={`absolute inset-y-0 right-0 pr-4 h-14 flex items-center justify-center ${
            disabled ? "cursor-not-allowed" : ""
          }`}
          tabIndex={0}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff
              className={`h-5 w-5 mx-auto my-auto transition-colors duration-200 ${
                disabled ? "text-gray-400" : "text-gray-300 hover:text-blue-400"
              }`}
            />
          ) : (
            <Eye
              className={`h-5 w-5 mx-auto my-auto transition-colors duration-200 ${
                disabled ? "text-gray-400" : "text-gray-300 hover:text-blue-400"
              }`}
            />
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

// Main LoginPage Component
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const { isLoggingIn, login } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = "Username or email is required";
    } else if (formData.usernameOrEmail.trim().length < 3) {
      newErrors.usernameOrEmail =
        "Username or email must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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

    try {
      const loginres = await login(formData);
      toast.success(`Welcome, ${loginres.user?.username || "user"}!`);
      // Optionally redirect here
    } catch (error) {
      let message = "Failed to login. Please try again.";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      toast.error(message);
    }
  };

  // Navigation for Sign Up button
  const handleSignUp = (e) => {
    e.preventDefault();
    window.location.href = "/signup";
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-400">Sign in to continue chatting</p>
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
                name="usernameOrEmail"
                placeholder="Username or Email"
                value={formData.usernameOrEmail}
                onChange={handleInputChange}
                error={errors.usernameOrEmail}
                disabled={isLoggingIn}
                autoComplete="username"
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
                disabled={isLoggingIn}
                autoComplete="current-password"
                required
              />
              {/* Reserve space for error messages to prevent layout shift */}
              <div style={{ minHeight: "24px" }}></div>
              {/* Forgot Password Link */}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 min-h-[56px]"
                aria-busy={isLoggingIn}
                aria-disabled={isLoggingIn}
              >
                <span className="flex items-center justify-center w-full">
                  {isLoggingIn ? (
                    <>
                      <span className="inline-block mr-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </span>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      <span>Sign In</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
                  disabled={isLoggingIn}
                  onClick={handleSignUp}
                  tabIndex={0}
                  type="button"
                >
                  Sign Up
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

export default LoginPage;
