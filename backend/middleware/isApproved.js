const User = require("../models/User");

// Middleware to check if a student is approved
exports.isApproved = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Log the user object for debugging
    console.log("Fetched user:", user);

    // Check if the user exists and is a student
    if (!user || user.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Log the approval status for debugging
    console.log(`User ${user.name}'s approval status: ${user.isApproved}`);

    // Check if the student is approved
    if (!user.isApproved) {
      return res.status(403).json({ message: "Your registration is not approved yet." });
    }

    // Proceed to the next middleware if approved
    next();
  } catch (error) {
    console.error("Middleware Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

