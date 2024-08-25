//StudentRoute.js - Registeration and Login, Search Teacher, Book Appointment, Send Message, Logout.


const express = require("express");
const router = express.Router();
const { register, login, getMe, searchTeachers, bookAppointment, sendMessage, logout } = require("../controllers/studentController");
const { isAuthenticated } = require("../middleware/auth");
const { isApproved } = require("../middleware/isApproved");

// Register Student
router.post("/register", register);

// Login Student
router.post("/login",isApproved, login);

// Get Logged-In Student's Details
router.get("/me", isAuthenticated, getMe);

// Search Teacher
router.get("/search-teachers", isAuthenticated, searchTeachers);

// Book Appointment
router.post("/book-appointment", isAuthenticated, bookAppointment);

// Send Message
router.post("/send-message", isAuthenticated, sendMessage);

// Logout
router.post("/logout", isAuthenticated, logout);

module.exports = router;
