const express = require("express");
const router = express.Router();
const Dentist = require("../models/Dentist");
const authMiddleware = require("../middleware/auth");

// GET /api/dentists — fetch all dentists (with optional search & filter)
router.get("/", async (req, res) => {
  try {
    const { search, location, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { clinicName: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [dentists, total] = await Promise.all([
      Dentist.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Dentist.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: dentists,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/dentists/:id — fetch single dentist
router.get("/:id", async (req, res) => {
  try {
    const dentist = await Dentist.findById(req.params.id);
    if (!dentist) {
      return res.status(404).json({ success: false, message: "Dentist not found" });
    }
    res.json({ success: true, data: dentist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/dentists — add a new dentist (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const dentist = new Dentist(req.body);
    await dentist.save();
    res.status(201).json({ success: true, data: dentist, message: "Dentist added successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/dentists/:id — update dentist (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const dentist = await Dentist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dentist) {
      return res.status(404).json({ success: false, message: "Dentist not found" });
    }
    res.json({ success: true, data: dentist, message: "Dentist updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/dentists/:id — delete dentist (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const dentist = await Dentist.findByIdAndDelete(req.params.id);
    if (!dentist) {
      return res.status(404).json({ success: false, message: "Dentist not found" });
    }
    res.json({ success: true, message: "Dentist deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
