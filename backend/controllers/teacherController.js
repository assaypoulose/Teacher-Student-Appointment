const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Message = require("../models/Message");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Teacher Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || user.role !== "teacher") {
      return res.status(400).json({ message: "Invalid credentials or access denied" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get logged-in teacher's details
exports.getMe = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all booked appointments for the logged-in teacher
exports.getAllBookedAppointments = async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    console.log("Fetching appointments for teacher ID:", teacherId);  // Debugging log
    
    // Find all appointments where the teacher is the recipient
    const appointments = await Appointment.find({ teacherId })
      .populate("studentId", "name email")
      .populate("teacherId", "name email");

    if (!appointments || appointments.length === 0) {
      console.log("No appointments found for this teacher.");  // Debugging log
      return res.status(404).json({ message: "No appointments found" });
    }

    console.log("Appointments retrieved successfully.");  // Debugging log
    res.status(200).json({ message: "Appointments retrieved successfully", appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);  // Error log
    res.status(500).json({ message: "Server error", error });
  }
};


// Schedule Appointment (for teacher to create an appointment)
exports.scheduleAppointment = async (req, res) => {
  try {
    const { studentId, appointmentDate } = req.body;

    // Validation: Ensure required fields are present
    if (!studentId || !appointmentDate) {
      return res.status(400).json({ message: "Student ID and Appointment Date are required" });
    }

    // Ensure req.user is populated with the authenticated teacher's data
    const teacherId = req.user._id;
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is missing. Please authenticate first." });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      studentId,
      teacherId, // Assign the logged-in teacher's ID
      appointmentDate,
      purpose: "New appointment", // You can change this if you want to provide a specific purpose
    });

    await newAppointment.save();

    return res.status(201).json({ message: "Appointment scheduled successfully", appointment: newAppointment });
  } catch (error) {
    console.error("Server error while scheduling appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve a specific appointment
exports.approveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    // Find the appointment and ensure the logged-in teacher is the recipient
    const appointment = await Appointment.findOne({ _id: id, teacherId });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or you do not have permission to approve this appointment" });
    }

    // Approve the appointment
    appointment.status = "approved";
    await appointment.save();

    res.status(200).json({ message: "Appointment approved successfully", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    // Find the appointment and ensure the logged-in teacher is the recipient
    const appointment = await Appointment.findOne({ _id: id, teacherId });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or you do not have permission to cancel this appointment" });
    }

    // Cancel the appointment
    appointment.status = "canceled";
    await appointment.save();

    res.status(200).json({ message: "Appointment canceled successfully", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllStudents = async (req, res) => {
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
}

// View Messages (messages sent to the teacher)
exports.viewMessages = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Get all messages sent to the teacher and populate the senderId with the student's name
    const messages = await Message.find({ recipientId: teacherId })
      .populate('senderId', 'name') // Populate senderId to get the student's name
      .exec();

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//mark read messages
exports.markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;

    // Find the message and mark it as read
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: "Server error", error });
  }
};


// View All Appointments
exports.viewAllAppointments = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Find all appointments associated with the teacher
    const appointments = await Appointment.find({ teacherId });

    res.status(200).json({ appointments });
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
