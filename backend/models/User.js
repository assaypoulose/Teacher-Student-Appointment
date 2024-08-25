const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },
    // Additional fields for teachers
    department: {
      type: String,
    },
    subject: {
      type: String,
    },
    isApproved: 
    { 
      type: Boolean, 
      default: false 
    },  // Ensure this exists
    // Additional fields for students can be added as needed
    registeredDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
