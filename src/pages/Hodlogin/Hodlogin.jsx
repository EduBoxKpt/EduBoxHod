// src/pages/Hodlogin/Hodlogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Hodlogin.css";

const baseUrl = process.env.REACT_APP_BASE_URL;

const Hodlogin = ({ setIsHodLoggedIn }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/hod/login`, credentials);

      if (response.status === 200) {
        alert("Login Successful!");
        localStorage.setItem("hodToken", response.data.token);
        localStorage.setItem("hodBranch", response.data.branch);
        
        // Update global state
        setIsHodLoggedIn(true);
        
        navigate("/");
 // Redirect to HOD dashboard
        
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="hod-login-container">
      <h2>HOD Login</h2>
      <form className="hod-login-form" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Hodlogin;
