//TeacherRoute.js - Login, Schedule Appointment, Approve/cancel Appointment, View Messages, View All Appointment, Logout

const express = require("express");
const router = express.Router();
const { login, getMe, scheduleAppointment, approveAppointment, cancelAppointment, getAllStudents, viewMessages, markMessageAsRead, getAllBookedAppointments, logout } = require("../controllers/teacherController");
const { isAuthenticated, isTeacher } = require("../middleware/auth");

// Login Teacher
router.post("/login", login);

// Get logged-in teacher details
router.get("/me", isAuthenticated, isTeacher, getMe);  // Add this route

// Get all booked appointments for a teacher
router.get("/booked-appointments", isAuthenticated, isTeacher, getAllBookedAppointments);

// Approve a specific appointment
router.post("/approve-appointment/:id", isAuthenticated, isTeacher, approveAppointment);

// Cancel Appointment
router.post("/cancel-appointment/:id", isAuthenticated, isTeacher, cancelAppointment);

//get all students
router.get("/students",isAuthenticated, isTeacher, getAllStudents)

// Schedule Appointment
router.post("/schedule-appointment", isAuthenticated, isTeacher, scheduleAppointment);

// View Messages
router.get("/messages", isAuthenticated, isTeacher, viewMessages);

//mark readmessages
router.post('/messages/:id/read', isAuthenticated, isTeacher, markMessageAsRead);

// Logout
router.post("/logout", isAuthenticated, logout);

module.exports = router;
