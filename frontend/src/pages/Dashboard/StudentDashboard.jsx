import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function StudentDashboard() {
  const [studentName, setStudentName] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");
  const [appointmentSuccess, setAppointmentSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchStudentDetails = async () => {
        try {
          const token = localStorage.getItem('token');  // Get the token from localStorage
          if (!token) {
            throw new Error('User is not authenticated');
          }
  
          // Fetch the authenticated student's details from the backend
          const response = await axios.get(`${baseURL}/student/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          setStudentName(response.data.name || '');  // Ensure the student name is a string
        } catch (error) {
          console.error('Error fetching student details:', error);
          setError('Failed to load student details.');
        }
    };

    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User is not authenticated");
        }

        const response = await axios.get(`${baseURL}/student/search-teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(response.data.teachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setError("Failed to load teachers.");
      }
    };

    fetchStudentDetails();
    fetchTeachers();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setAppointmentSuccess("");
    setError("");

    if (!selectedTeacherId || !appointmentDate || !purpose) {
      setError("Please fill out all the fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURL}/student/book-appointment`,
        {
          teacherId: selectedTeacherId,
          appointmentDate,
          purpose,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setAppointmentSuccess("Appointment booked successfully!");
        setAppointmentDate("");
        setPurpose("");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError("Failed to book the appointment. Please try again.");
    }
  };

  const handleSendMessage = async () => {
    setError("");
    if (!selectedTeacherId || !message) {
      setError("Please select a teacher and enter a message.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURL}/student/send-message`,
        {
          recipientId: selectedTeacherId,
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setMessage("");
        setAppointmentSuccess("Message sent successfully!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Optional: Call the logout API if necessary
        await axios.post(
          `${baseURL}/student/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Remove token from localStorage
      localStorage.removeItem('token');

      // Redirect to the home page
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    
    <div className="flex flex-col gap-6 items-center mt-[10px] min-h-screen px-6 py-4">
      <div className="flex justify-between items-center p-4">
      {/* Display student name */}
      <h1 className="font-bold text-4xl">
        <u>Welcome, {studentName ? studentName.toUpperCase() : "Student"}!</u>
      </h1>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
      <div className="border border-gray-300 rounded-lg p-6 shadow-lg">
        {/* Teacher Search and Selection */}
        <div className="flex flex-col items-center">
          <h1 className="font-bold">BOOK YOUR APPOINTMENT</h1>
          <h2 className="font-thin mt-4 mb-4">Search and Select Teacher</h2>
          {error && <p className="text-red-500">{error}</p>}
          <select
            className="p-2 text-black w-[400px] border border-gray-300 rounded mb-4"
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
          >
            <option value="">Select a Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name} - {teacher.department}
              </option>
            ))}
          </select>

          {/* Book Appointment Form */}
          <form onSubmit={handleBookAppointment} className="flex flex-col gap-4">
            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="p-2 text-black border w-[400px] border-gray-300 rounded"
              required
            />
            <textarea
              placeholder="Enter the purpose of the appointment..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="p-2 text-black border w-[400px] h-[100px] border-gray-300 rounded"
              required
            />
            <button type="submit" className="p-2 bg-green-400 text-white rounded">
              Book Appointment
            </button>
          </form>

          {appointmentSuccess && (
            <p className="text-green-500 mt-4">{appointmentSuccess}</p>
          )}
        </div>

        {/* Send Message Form */}
        <div className="flex flex-col items-center mt-6">
          <h2 className="font-bold">SEND A MESSAGE</h2>
          <textarea
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 text-black border w-[600px] h-[150px] border-gray-300 rounded"
          />
          <button onClick={handleSendMessage} className="p-2 bg-teal-600 text-white rounded mt-4">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
