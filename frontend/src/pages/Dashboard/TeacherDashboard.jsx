import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState(""); // State for teacher name
  const [appointments, setAppointments] = useState([]);

  const [messages, setMessages] = useState([]); // State for messages
  const [students, setStudents] = useState([]); // State for student list
  const [selectedStudentId, setSelectedStudentId] = useState(""); // State for selected student
  const [newAppointmentDate, setNewAppointmentDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch teacher details, appointments, and messages when the component mounts
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch teacher details
        const teacherResponse = await axios.get(
          `${baseURL}/teachers/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeacherName(teacherResponse.data.name);

        // Fetch all booked appointments for the logged-in teacher
        const appointmentResponse = await axios.get(
          `${baseURL}/teachers/booked-appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Sort appointments initially (pending on top)
      const sortedAppointments = sortAppointments(appointmentResponse.data.appointments);
      setAppointments(sortedAppointments);

        // Fetch messages sent to the teacher
        const messagesResponse = await axios.get(
          `${baseURL}/teachers/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Sort messages by unread status (unread on top)
        const sortedMessages = sortMessages(messagesResponse.data.messages);
        setMessages(sortedMessages);

        // Fetch the list of students
        const studentsResponse = await axios.get(
          `${baseURL}/teachers/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(studentsResponse.data.students);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      }
    };
    

    fetchTeacherData();
  }, []);

  // Sort function for appointments (pending first, followed by approved/canceled)
const sortAppointments = (appointments) => {
  return appointments.sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") {
      return -1;
    }
    if (a.status !== "pending" && b.status === "pending") {
      return 1;
    }
    return new Date(a.appointmentDate) - new Date(b.appointmentDate); // Sort by date within the same status
  });
};

  // Handle approving or canceling appointments
// Handle approving or canceling appointments
const handleUpdateAppointmentStatus = async (appointmentId, status) => {
  try {
    const token = localStorage.getItem("token");

    // Log to confirm the ID and status being sent
    console.log("Updating appointment ID:", appointmentId, "with status:", status);

    const response = await axios.post(
      `${baseURL}/teachers/${status === "approved" ? "approve-appointment" : "cancel-appointment"}/${appointmentId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Log the response to confirm the API call was successful
    console.log("Response from server:", response.data);

    if (response.status === 200) {
      // Update the local appointments list to reflect the change
      setAppointments((prevAppointments) => {
        const updatedAppointments = prevAppointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status } : appointment
        );

        // Re-sort appointments after updating status
        return sortAppointments(updatedAppointments);
      });

      // Log to confirm the successful update
      console.log("Updated appointments:", appointments);
    } else {
      setError("Failed to update appointment status.");
    }
  } catch (error) {
    console.error("Error updating appointment status:", error);
    setError("Failed to update appointment status.");
  }
};



  // Handle scheduling/rescheduling appointments
  const handleScheduleAppointment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
  
      // Ensure a student is selected before proceeding
      if (!selectedStudentId) {
        setError("Please select a student.");
        return;
      }
  
      // Ensure the appointment date is set
      if (!newAppointmentDate) {
        setError("Please select a valid appointment date.");
        return;
      }
  
      // Send request to schedule an appointment for the selected student
      const response = await axios.post(
        `${baseURL}/teachers/schedule-appointment`,
        { studentId: selectedStudentId, appointmentDate: newAppointmentDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setError("Appointment scheduled successfully.");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setError("Failed to schedule appointment.");
    }
  };
  

  // Function to mark a message as read
  const handleMarkAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURL}/teachers/messages/${messageId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Update the messages list after marking a message as read
        const updatedMessages = messages.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        );
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  // Function to sort messages: unread messages appear at the top
  const sortMessages = (messages) => {
    return messages.sort((a, b) => a.isRead - b.isRead);
  };

  

  // Logout the teacher
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col mt-[75px] items-center gap-6 p-6">
      <h1 className="text-2xl font-bold"><u>Teacher Dashboard</u></h1>

      {/* Display teacher's name */}
      <h2 className="text-xl font-semibold mt-2">Welcome, {teacherName}!</h2>
      <div className="flex gap-10">

      {/* Appointments Section */}
      <section className="w-full max-w-3xl bg-teal-800 border-gray-300 rounded-lg p-6 shadow-lg max-h-[400px] overflow-y-auto mx-auto ">
      <h2 className="text-xl font-bold mb-4">Appointments</h2>
      {error && <p className="text-green-950">{error}</p>}

      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div key={appointment._id} className="border p-4 rounded-lg mb-4">
            <p>
              <strong>Student:</strong> {appointment.studentId.name}
            </p>
            <p>
              <strong>Message:</strong> {appointment.purpose}
            </p>
            <p>
              <strong>Status:</strong> {appointment.status}
            </p>
            <p>
              <strong>Appointment Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}
            </p>
            <div className="mt-2">
              {appointment.status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      handleUpdateAppointmentStatus(appointment._id, "approved")
                    }
                    className="p-2 bg-green-500 text-white rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateAppointmentStatus(appointment._id, "canceled")
                    }
                    className="p-2 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No appointments available.</p>
      )}
    </section>

      {/* Schedule Appointment Section */}
<section className="w-full max-w-3xl bg-teal-800 border-gray-300 rounded-lg p-6 shadow-lg max-h-[400px] overflow-y-auto mx-auto">
  <h2 className="text-xl font-bold mb-4">Schedule an Appointment :</h2>
  {error && <p className="text-green-950">{error}</p>}
  <form onSubmit={handleScheduleAppointment} className="flex flex-col gap-4">
    <select
      value={selectedStudentId}
      onChange={(e) => setSelectedStudentId(e.target.value)}
      className="p-2 border text-black border-gray-300 rounded"
      required
    >
      <option value="" disabled>Select a student</option>
      {students.length > 0 &&
        students.map((student) => (
          <option key={student._id} value={student._id}>
            {student.name}
          </option>
        ))}
    </select>
    <input
      type="datetime-local"
      value={newAppointmentDate}
      onChange={(e) => setNewAppointmentDate(e.target.value)}
      className="p-2 border text-black border-gray-300 rounded"
      required
    />
    <button type="submit" className="p-2 bg-green-500 text-white rounded">
      Schedule Appointment
    </button>
  </form>
</section>


      {/* Messages Section */}
<section className="w-full max-w-3xl bg-teal-800 border-gray-300 rounded-lg p-6 shadow-lg max-h-[400px] overflow-y-auto mx-auto">
  <h2 className="text-xl font-bold mb-4">Messages :</h2>
  {messages.length > 0 ? (
    messages.map((message) => (
      <div key={message._id} className="border p-4 rounded-lg mb-4">
        <p>
          <strong>Message:</strong> {message.message}
        </p>
        <p>
          <strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Student Name:</strong> {message.senderId?.name || "N/A"}
        </p>

        <div className="mt-4 flex justify-end gap-4">
              {!message.isRead && (
                <button
                  onClick={() => handleMarkAsRead(message._id)}
                  className="p-2 bg-teal-600 text-white rounded"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
    ))
  ) : (
    <p>No messages available.</p>
  )}
</section>
</div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="p-2 bg-red-600 text-white rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
}

export default TeacherDashboard;
