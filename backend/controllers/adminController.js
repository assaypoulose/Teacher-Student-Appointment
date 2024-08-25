const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const adminExists = await User.findOne({ email, role: "admin" });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    console.log("User found:", user); // Debugging output

    if (!user || user.role !== "admin") {
      return res.status(400).json({ message: "Only admins can log in. Access denied." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Debugging output

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Error during login:", error); // Debugging output
    res.status(500).json({ message: "Server error", error });
  }
};

// Add Teacher
exports.addTeacher = async (req, res) => {
  try {
    const { name, email, password, department, subject, age } = req.body;

    // Check if teacher already exists
    const teacherExists = await User.findOne({ email, role: "teacher" });
    if (teacherExists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new teacher
    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      department,
      subject,
      age,
    });

    res.status(201).json({ message: "Teacher added successfully", teacher });
  } catch (error) {
    console.error("Error adding teacher:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, subject, age } = req.body;

    // Find the teacher by id and update
    const teacher = await User.findByIdAndUpdate(
      id,
      { name, email, department, subject, age },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the teacher
    const teacher = await User.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/// Approve Student Registration
exports.approveStudentRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the student by id
    const student = await User.findById(id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Log the current approval status before updating
    console.log(`Current approval status of student ${student.name}: ${student.isApproved}`);

    // Approve student registration
    student.isApproved = true;

    // Save the changes and log success or failure
    const updatedStudent = await student.save();
    console.log(`Updated approval status of student ${updatedStudent.name}: ${updatedStudent.isApproved}`);

    res.status(200).json({ message: "Student registration approved", student: updatedStudent });
  } catch (error) {
    console.error("Error approving student:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Get All Teachers
exports.getAllTeachers = async (req, res) => {
  try {
    // Find all users with the role of "teacher"
    const teachers = await User.find({ role: "teacher" });

    if (teachers.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }

    res.status(200).json({ message: "Teachers retrieved successfully", teachers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Registered Students
exports.getAllRegisteredStudents = async (req, res) => {
  try {
    // Find all users with the role of "student" and isApproved set to true
    const students = await User.find({ role: "student", isApproved: true });

    if (students.length === 0) {
      return res.status(404).json({ message: "No registered students found" });
    }

    res.status(200).json({ message: "Registered students retrieved successfully", students });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Logout Admin
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
