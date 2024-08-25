import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const baseURL = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${baseURL}/student/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        // Assuming a successful login returns a token
        localStorage.setItem("token", response.data.token);
        navigate("/student-dashboard");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex flex-col gap-7 items-center justify-center min-h-screen">
      <div className="flex flex-col gap-7 items-center justify-center border border-gray-300 rounded-lg p-6 shadow-lg">
      <h1 className="font-bold text-2xl">Student Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-[450px]">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border text-black border-gray-300 rounded"
          required
        />
        <p>Email: student1@gmail.com</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border text-black border-gray-300 rounded"
          required
        />
        <p>Password: student1234</p>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="p-2 mt-5 bg-green-500 text-white rounded">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register/student" className="text-pink-200"><u>Register here</u></a>
      </p>
      </div>
    </div>
  );
}

export default StudentLogin;
