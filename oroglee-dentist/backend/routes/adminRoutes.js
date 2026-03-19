const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// POST /api/admin/login — admin login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username, role: "admin" },
    process.env.JWT_SECRET || "oroglee_secret",
    { expiresIn: "24h" }
  );

  res.json({
    success: true,
    token,
    message: "Login successful",
    admin: { username, role: "admin" },
  });
});

// POST /api/admin/verify — verify token
router.post("/verify", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "oroglee_secret");
    res.json({ success: true, admin: decoded });
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});

module.exports = router;
