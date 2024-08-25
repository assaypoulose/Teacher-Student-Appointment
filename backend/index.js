const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Import routers
const adminRoutes = require("./routes/adminRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");





// Initialize the app
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());  // Parses incoming JSON requests
app.use(cors());  // Enables Cross-Origin Resource Sharing

// DB Connection
const connectDB = require('./db');
connectDB();

// Basic route
app.get("/", (req, res) => {
    res.send("Welcome to Student-Teacher-Appointment-Backend");
});


// Routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/student", studentRoutes);




// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
