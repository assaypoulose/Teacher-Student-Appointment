const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Message = require("../models/Message");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Student Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    res.status(201).json({ message: "Student registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Student Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || user.role !== "student") {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get logged-in student details
exports.getMe = async (req, res) => {
  try {
    // Find the user by their ID (already populated by the `isAuthenticated` middleware)
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Return the student's details (excluding sensitive information like password)
    const { password, ...studentData } = user._doc;  // This excludes the password from the response
    res.status(200).json(studentData);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Search Teachers
exports.searchTeachers = async (req, res) => {
  try {
    const { department, subject } = req.query;

    // Query to search teachers by department and subject
    const teachers = await User.find({
      role: "teacher",
      ...(department && { department }),
      ...(subject && { subject }),
    });

    res.status(200).json({ teachers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Book Appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { teacherId, appointmentDate, purpose } = req.body;
    const studentId = req.user.id;

    // Create appointment
    const appointment = await Appointment.create({
      studentId,
      teacherId,
      appointmentDate,
      purpose,
      status: "pending",
    });

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user.id;

    // Create message
    const newMessage = await Message.create({
      senderId,
      recipientId,
      message,
    });

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
