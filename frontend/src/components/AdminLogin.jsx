import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      // Send login request to the backend
      const baseURL = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${baseURL}/admin/login`, {
        email,
        password,
      });
  
      // Check if the login was successful and if the user is an admin
      if (response.status === 200 && response.data.role === "admin") {
        // Store the token and navigate to the admin dashboard
        localStorage.setItem("token", response.data.token);
        navigate("/admin-dashboard");
      } else {
        setError("Only admins can log in. Access denied.");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };
  

  return (
    <div className="flex flex-col gap-7 items-center mt-[200px]">
      <div className="border border-gray-300 rounded-lg p-6 shadow-lg">
        <h1 className="font-bold text-2xl text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col mt-10 gap-4 w-[450px]">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border text-black border-gray-300 rounded"
            required
          />
          <p>email: admin@example.com</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border text-black border-gray-300 rounded"
            required
          />
          <p>password: admin123</p>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="p-2 mt-5 bg-green-500 text-white rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}  

export default AdminLogin;
