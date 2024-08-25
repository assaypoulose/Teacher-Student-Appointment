// adminRoute.js - adminRegistration, Add Teacher -(Name, email, password, Department, subject, age). Update/Delete Teacher and Approve Student Registration, Logout

const express = require("express");
const router = express.Router();
const { registerAdmin, login, addTeacher, updateTeacher, deleteTeacher, approveStudentRegistration, getAllTeachers, getAllRegisteredStudents, logout } = require("../controllers/adminController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Register Admin
router.post("/register", registerAdmin);

// Admin Login
router.post("/login", login);

// Add Teacher
router.post("/add-teacher", isAuthenticated, isAdmin, addTeacher);

// Update Teacher
router.put("/update-teacher/:id", isAuthenticated, isAdmin, updateTeacher);

// Delete Teacher
router.delete("/delete-teacher/:id", isAuthenticated, isAdmin, deleteTeacher);

// Get All Teachers
router.get("/teachers", isAuthenticated, isAdmin, getAllTeachers);

// Approve Student Registration
router.post("/approve-student/:id", isAuthenticated, isAdmin, approveStudentRegistration);

// Get All Registered Students
router.get("/students", isAuthenticated, isAdmin, getAllRegisteredStudents);  // New route for fetching students


// Logout Admin
router.post("/logout", isAuthenticated, logout);

module.exports = router;
