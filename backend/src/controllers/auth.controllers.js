import {
  createAccessToken,
  createRefreshToken,
} from "../lib/createAccessToken.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { username, password, fullname, email } = req.body;
  if (!username || !password || !fullname || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    //validate username can only be alphanumeric and can contain underscores and periods as well, peroiods must not be at the start or end of the username, and must not be consecutive
    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Username can only contain alphanumeric characters, underscores, and periods. Periods cannot be at the start or end, and cannot be consecutive.",
      });
    }
    //validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    //validate full name
    const fullnameRegex = /^[a-zA-Z\s]+$/;
    if (!fullnameRegex.test(fullname)) {
      return res
        .status(400)
        .json({ message: "Full name can only contain letters and spaces" });
    }
    //lowercase and trim the username
    const normalizedUsername = username.toLowerCase().trim();
    //lowercase and trim the email
    const normalizedEmail = email.toLowerCase().trim();
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Create new user
    const newUser = new User({
      username: normalizedUsername,
      fullName: fullname.trim(),
      password,
      email: normalizedEmail,
    });
    await newUser.save();

    //remove password from the response and send the user
    const { password: _, ...userData } = newUser.toObject();
    // Generate access and refresh tokens
    const accessToken = await createAccessToken(newUser);
    const refreshToken = await createRefreshToken(newUser);
    // Update user with tokens
    newUser.accessToken = accessToken;
    newUser.refreshToken = refreshToken;
    await newUser.save();
    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    // Return user data excluding password
    return res.status(201).json({
      message: "Signup successful",
      user: userData,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res
        .status(400)
        .json({ message: "Username/Email and password are required" });
    }
    const existingUser = await User.findOne({
      $or: [
        { username: usernameOrEmail.toLowerCase().trim() },
        { email: usernameOrEmail.toLowerCase().trim() },
      ],
    }).select("+password");
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Check if password matches
    const isPasswordValid = await existingUser.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate access and refresh tokens
    const accessToken = await createAccessToken(existingUser);
    const refreshToken = await createRefreshToken(existingUser);
    // Update user with tokens
    existingUser.accessToken = accessToken;
    existingUser.refreshToken = refreshToken;
    await existingUser.save();
    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    // If login is successful, send user data (excluding password)
    const { password: _, ...userData } = existingUser.toObject();
    return res.status(200).json({
      message: "Login successful",
      user: userData,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    //console.log(req.user);
    const userId = req.user._id.toString();
    //console.log(userId);
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    // Find user and clear tokens
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.accessToken = null;
    user.refreshToken = null;
    await user.save();
    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    // Check if req.body exists and has profilePic
    if (!req.body || !req.body.profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const { profilePic } = req.body;

    // Check if req.user and userId exist
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const userId = req.user._id.toString();

    // Upload to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profile_pics",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    });
    if (!uploadResponse || !uploadResponse.secure_url) {
      return res
        .status(500)
        .json({ message: "Failed to upload profile picture" });
    }
    // Update user
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return updated user data excluding password
    const { password, ...updatedUser } = updateUser.toObject();
    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error during profile update:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User is authenticated",
      user: user,
    });
  } catch (error) {
    console.error("Error during checkAuth:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
