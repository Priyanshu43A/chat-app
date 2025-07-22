import jwt from "jsonwebtoken";

export const createAccessToken = async (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
  };

  // Generate a JWT token with the payload
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expiration time
  });

  return accessToken;
};

export const createRefreshToken = async (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
  };

  // Generate a JWT token with the payload
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d", // Token expiration time
  });

  return refreshToken;
};
