const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Dentist = require("../models/Dentist");

dotenv.config();

const dentists = [
  {
    name: "Dr. Priya Sharma",
    qualification: "BDS, MDS in Orthodontics",
    yearsOfExperience: 12,
    clinicName: "SmileCare Dental Studio",
    address: "123, Jubilee Hills Road, Near Apollo Hospital",
    location: "Hyderabad",
    photo:
      "https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827776.jpg",
    specialization: "Orthodontics & Braces",
    rating: 4.8,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    name: "Dr. Rajesh Kumar",
    qualification: "BDS, MDS (Prosthodontics)",
    yearsOfExperience: 15,
    clinicName: "PerfectSmile Clinic",
    address: "45, Banjara Hills, Road No. 12",
    location: "Hyderabad",
    photo:
      "https://thumbs.dreamstime.com/b/african-male-doctor-happy-tablet-computer-34481166.jpg",
    specialization: "Dental Implants & Crowns",
    rating: 4.9,
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
  },
  {
    name: "Dr. Aishwarya Reddy",
    qualification: "BDS, MDS (Pedodontics)",
    yearsOfExperience: 8,
    clinicName: "KiddoCare Dental",
    address: "78, Kondapur Main Road",
    location: "Hyderabad",
    photo: "https://cdn6.dissolve.com/p/D2115_159_258/D2115_159_258_1200.jpg",
    specialization: "Children's Dentistry",
    rating: 4.7,
    availableDays: ["Tuesday", "Thursday", "Saturday"],
  },
  {
    name: "Dr. Arjun Mehta",
    qualification: "BDS, MDS (Oral Surgery)",
    yearsOfExperience: 18,
    clinicName: "MaxFace Dental Center",
    address: "22, Koramangala Block 5",
    location: "Bangalore",
    photo:
      "https://plus.unsplash.com/premium_photo-1723514536306-26fe5c4adeb7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG1hbGUlMjBkb2N0b3J8ZW58MHx8MHx8fDA%3D",
    specialization: "Oral & Maxillofacial Surgery",
    rating: 4.9,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    name: "Dr. Sneha Patel",
    qualification: "BDS, Certificate in Cosmetic Dentistry",
    yearsOfExperience: 6,
    clinicName: "GlamSmile Studio",
    address: "88, Indiranagar 100 Feet Road",
    location: "Bangalore",
    photo:
      "https://t3.ftcdn.net/jpg/15/75/74/62/360_F_1575746216_ZS5ovZG1rHulQUatTq0WVno9BGInMCwW.jpg",
    specialization: "Cosmetic & Aesthetic Dentistry",
    rating: 4.6,
    availableDays: ["Monday", "Wednesday", "Thursday", "Friday"],
  },
  {
    name: "Dr. Vikram Nair",
    qualification: "BDS, MDS (Endodontics)",
    yearsOfExperience: 10,
    clinicName: "RootCare Dental Clinic",
    address: "34, Anna Nagar East, 3rd Street",
    location: "Chennai",
    photo:
      "https://static9.depositphotos.com/1005893/1105/i/950/depositphotos_11050986-stock-photo-indian-male-doctor.jpg",
    specialization: "Root Canal Treatment",
    rating: 4.8,
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
  },
  {
    name: "Dr. Lakshmi Iyer",
    qualification: "BDS, MDS (Periodontics)",
    yearsOfExperience: 9,
    clinicName: "GumHealth Specialists",
    address: "15, T. Nagar, Pondy Bazaar",
    location: "Chennai",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXA6KNFH83dYf0G9evgKfdMAJ6KARTLqE1xQ&s",
    specialization: "Gum Treatment & Periodontics",
    rating: 4.7,
    availableDays: ["Tuesday", "Wednesday", "Friday", "Saturday"],
  },
  {
    name: "Dr. Sameer Joshi",
    qualification: "BDS, MDS (Orthodontics), FAGE",
    yearsOfExperience: 20,
    clinicName: "Joshi Dental & Orthodontic Centre",
    address: "99, Viman Nagar, Near Inox",
    location: "Pune",
    photo:
      "https://t4.ftcdn.net/jpg/07/07/89/33/360_F_707893394_5DEhlBjWOmse1nyu0rC9T7ZRvsAFDkYC.jpg",
    specialization: "Orthodontics & Invisalign",
    rating: 5.0,
    availableDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  {
    name: "Dr. Sanjeev Skula",
    qualification: "BDS, MDS (Periodontics), FAGE",
    yearsOfExperience: 15,
    clinicName: "Sanjeev Dental & Periodontics Centre",
    address: "929, Near Bus Stop",
    location: "Hyderabad,Gachibowli",
    photo:
      "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg?semt=ais_hybrid&w=740&q=80",
    specialization: "Periodontics",
    rating: 4.5,
    availableDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  {
    name: "Dr. Rajeev Goud",
    qualification: "MBBS in Oral and Maxillofacial Surgery",
    yearsOfExperience: 18,
    clinicName: "Oral and Maxillofacial Surgery Clinic",
    address: "456, Near Mahiti Hotel",
    location: "Navi Mumbai",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsnj0UKZ4BfqVy7J2Q4tMOrt_5SvDiJomYaA&s",
    specialization: "Oral and Maxillofacial Surgery",
    rating: 4.6,
    availableDays: ["Monday", "Tuesday", "Wednesday"],
  },
  {
    name: "Dr. Raghu",
    qualification: "BDS in Pedodontics",
    yearsOfExperience: 14,
    clinicName: "Children Dental Care",
    address: "32, Near Karol Bagh ,Central Delhi",
    location: "Delhi",
    photo:
      "https://thumbs.dreamstime.com/b/young-male-doctor-close-up-happy-looking-camera-56751540.jpg",
    specialization: "Pedodontics",
    rating: 4.3,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    name: "Dr.Katrina Agarwal",
    qualification: "BDS, MDS in Prosthodontics",
    yearsOfExperience: 12,
    clinicName: "Prosthodontics Clinic",
    address: "909, Near Mahima Hall",
    location: "Chennai",
    photo:
      "https://i.pinimg.com/736x/7e/91/b7/7e91b721691322422919eec7dc039618.jpg",
    specialization: "Periodontics",
    rating: 4,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    name: "Dr. Lakshmi Priya",
    qualification: "BDS, MDS Oral Pathology",
    yearsOfExperience: 10,
    clinicName: "Oral Pathology diagnosis Lab",
    address: "12, Beside Nehru Park",
    location: "Hyderabad",
    photo:
      "https://thumbs.dreamstime.com/b/young-indian-female-doctor-holding-red-heart-shape-happy-77438932.jpg",
    specialization: " Oral Pathology",
    rating: 4.6,
    availableDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  {
    name: "Dr. Nittesh",
    qualification: "BDS, MDS (Prosthodontics)",
    yearsOfExperience: 12,
    clinicName: "Prosthodontics Clinic",
    address: "34, Beside South India Shopping mall",
    location: "Hyderabad, Kukatpally",
    photo:
      "https://thumbs.dreamstime.com/b/young-male-doctor-close-up-happy-looking-camera-56751540.jpg",
    specialization: "Prosthodontics",
    rating: 4.7,
    availableDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
];

async function seedDentists() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/oroglee_dentist",
    );
    console.log("✅ Connected to MongoDB");

    await Dentist.deleteMany({});
    console.log("🗑️  Cleared existing dentists");

    const inserted = await Dentist.insertMany(dentists);
    console.log(`🌱 Seeded ${inserted.length} dentists successfully`);

    mongoose.connection.close();
    console.log("🔒 Connection closed");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
}

seedDentists();
