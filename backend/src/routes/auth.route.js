import express from "express";
import {
  signup,
  login,
  logout,
  updateProfilePic,
  checkAuth,
} from "../controllers/auth.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", protect, logout);

router.put("/update-profile-picture", protect, updateProfilePic);

router.get("/check-auth", protect, checkAuth);

export default router;
