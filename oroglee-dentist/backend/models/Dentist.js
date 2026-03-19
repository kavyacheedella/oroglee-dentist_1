const mongoose = require("mongoose");

const dentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dentist name is required"],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    clinicName: {
      type: String,
      required: [true, "Clinic name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    photo: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "General Dentistry",
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    availableDays: {
      type: [String],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dentist", dentistSchema);
