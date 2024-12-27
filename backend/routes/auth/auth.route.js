import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} from "../../controllers/auth/auth.controller.js";

const router = express.Router();

// Route for registering a new user
router.post("/register", registerUser);

// Route for logging in a user
router.post("/login", loginUser);

// Route for logging out a user
router.post("/logout", logoutUser);

// Protected route to check authentication status
router.get("/check-auth", authMiddleware, (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying authentication",
      error: error.message,
    });
  }
});

export default router;
