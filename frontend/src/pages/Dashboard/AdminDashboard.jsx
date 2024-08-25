import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    subject: "",
    age: "",
  });
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const teacherResponse = await axios.get(`${baseURL}/admin/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(teacherResponse.data.teachers);

        const studentResponse = await axios.get(`${baseURL}/admin/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingStudents(studentResponse.data.students);
      } catch (error) {
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  const handleAddOrUpdateTeacher = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const token = localStorage.getItem("token");
    const url = editingTeacherId
      ? `${baseURL}/admin/update-teacher/${editingTeacherId}`
      : `${baseURL}/admin/add-teacher`;

    try {
      const response = await axios({
        method: editingTeacherId ? "put" : "post",
        url,
        data: teacherData,
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(`Teacher ${editingTeacherId ? "updated" : "added"} successfully.`);
      if (editingTeacherId) {
        setTeachers((prev) =>
          prev.map((teacher) => (teacher._id === editingTeacherId ? response.data.teacher : teacher))
        );
      } else {
        setTeachers((prev) => [...prev, response.data.teacher]);
      }
      setTeacherData({ name: "", email: "", password: "", department: "", subject: "", age: "" });
      setEditingTeacherId(null);
    } catch (error) {
      setError("Failed to save teacher.");
    }
  };

  const handleEditTeacher = (teacher) => {
    setTeacherData(teacher);
    setEditingTeacherId(teacher._id);
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/admin/delete-teacher/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
      setSuccess("Teacher deleted successfully.");
    } catch (error) {
      setError("Failed to delete teacher.");
    }
  };

  const handleApproveStudent = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseURL}/admin/approve-student/${studentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPendingStudents(pendingStudents.filter((student) => student._id !== studentId));
      setSuccess("Student approved successfully.");
    } catch (error) {
      setError("Failed to approve student.");
    }
  };

  // Logout the admin
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="flex flex-col md:flex-row justify-between w-full max-w-6xl gap-8">
        {/* Add/Update Teacher Section */}
        <section className="flex-1 mb-8 p-6 border border-gray-300 rounded-lg shadow-lg max-h-[500px] overflow-y-auto mx-auto">
          <h2 className="text-xl font-bold mb-4"><u>{editingTeacherId ? "Update Teacher" : "Add Teacher"}</u></h2>
          <form onSubmit={handleAddOrUpdateTeacher} className="text-black flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={teacherData.name}
              onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={teacherData.email}
              onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={teacherData.password}
              onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required={!editingTeacherId}
            />
            <input
              type="text"
              placeholder="Department"
              value={teacherData.department}
              onChange={(e) => setTeacherData({ ...teacherData, department: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={teacherData.subject}
              onChange={(e) => setTeacherData({ ...teacherData, subject: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={teacherData.age}
              onChange={(e) => setTeacherData({ ...teacherData, age: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
            <button type="submit" className="p-2 bg-green-500 text-white rounded">
              {editingTeacherId ? "Update Teacher" : "Add Teacher"}
            </button>
          </form>
        </section>

        {/* Manage Teachers / Approve Students Section */}
        <section className="flex-1 mb-8 p-6 border border-gray-300 rounded-lg shadow-lg max-h-[500px] overflow-y-auto mx-auto">
          <h2 className="text-xl font-bold mb-4"><u>Manage Teachers</u> </h2>

          {/* Manage Teachers */}
          <div className="mb-8">
            {teachers.length > 0 ? (
              <ul>
                {teachers.map((teacher) => (
                  <li key={teacher._id} className="mb-4 border p-4 rounded">
                    <p>
                      <strong>Name:</strong> {teacher.name}
                    </p>
                    <p>
                      <strong>Department:</strong> {teacher.department}
                    </p>
                    <p>
                      <strong>Subject:</strong> {teacher.subject}
                    </p>
                    <button
                      onClick={() => handleEditTeacher(teacher)}
                      className="p-2 bg-blue-500 text-white rounded mt-2 mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher._id)}
                      className="p-2 bg-red-500 text-white rounded mt-2"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No teachers available.</p>
            )}
          </div>
          </section>

          {/* Approve Students */}
          <section className="flex-1 mb-8 p-6 border border-gray-300 rounded-lg shadow-lg max-h-[500px] overflow-y-auto mx-auto">
          <h2 className="text-xl font-bold mb-4"> <u>Approve Students</u></h2>
          <div>
            {pendingStudents.length > 0 ? (
              <ul>
                {pendingStudents.map((student) => (
                  <li key={student._id} className="mb-4 border p-4 rounded">
                    <p>
                      <strong>Name:</strong> {student.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {student.email}
                    </p>
                    <button
                      onClick={() => handleApproveStudent(student._id)}
                      className="p-2 bg-green-500 text-white rounded mt-2"
                    >
                      Approve
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending students for approval.</p>
            )}
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
        </section>
      </div>

      <button
        onClick={handleLogout}
        className="p-2 bg-red-600 text-white rounded mt-4"
      >
        Logout
      </button>
    </div>
    
  );
}

export default AdminDashboard;
