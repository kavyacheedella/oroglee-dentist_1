const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const authMiddleware = require("../middleware/auth");

// POST /api/appointments — create a new appointment
router.post("/", async (req, res) => {
  try {
    const { patientName, age, gender, appointmentDate, dentistId, notes } = req.body;

    if (!patientName || !age || !gender || !appointmentDate || !dentistId) {
      return res.status(400).json({
        success: false,
        message: "All fields (patientName, age, gender, appointmentDate, dentistId) are required",
      });
    }

    // Prevent past-date bookings
    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Appointment date cannot be in the past",
      });
    }

    const appointment = new Appointment({
      patientName,
      age,
      gender,
      appointmentDate,
      dentist: dentistId,
      notes: notes || "",
    });

    await appointment.save();
    await appointment.populate("dentist", "name clinicName location");

    res.status(201).json({
      success: true,
      data: appointment,
      message: "Appointment booked successfully!",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/appointments — fetch all appointments (admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate("dentist", "name clinicName location")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Appointment.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: appointments,
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

// PATCH /api/appointments/:id/status — update appointment status (admin only)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Booked", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("dentist", "name clinicName location");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, data: appointment, message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
