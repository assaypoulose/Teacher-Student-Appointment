import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

        // Check if passwords match before sending data to the backend
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        
    try {
      /// Use the environment variable for the API base URL with Vite
    const baseURL = import.meta.env.VITE_BACKEND_URL;
    console.log("Base URL:", baseURL);  // Debugging to ensure the variable is correct
    
    const response = await axios.post(`${baseURL}/student/register`, {
      name,
      email,
      password,
    });
    
    console.log("Response:", response);

    if (response.status === 201) {
      // Registration successful, redirect to login page
      navigate("/login/student");
    }
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-7 items-center justify-center min-h-screen">
      <div className="flex flex-col gap-7 items-center justify-center border border-gray-300 rounded-lg p-6 shadow-lg">
      <h1 className="font-bold text-2xl">Student Registration</h1>
      <form onSubmit={handleRegister} className="w-[450px] flex flex-col gap-5">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border text-black border-gray-300 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border text-black border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border text-black border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Re-enter Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-2 mb-5 text-black border border-gray-300 rounded"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="p-2 bg-green-500 text-white rounded">
          Register
        </button>
      </form>
      <p>
        Already have an account? <a href="/login/student" className="text-pink-200"><u>Login here</u></a>
      </p>
      </div>
    </div>
  );
}

export default StudentRegister;
