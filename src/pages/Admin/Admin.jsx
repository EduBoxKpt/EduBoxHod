// src/components/AdminPage.jsx
import React, { useState } from "react";
import "./Admin.css";
import axios from 'axios';


const baseUrl = process.env.REACT_APP_BASE_URL;


const Admin = () => {
  const [hodDetails, setHodDetails] = useState({
    name: "",
    email: "",
    branch: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHodDetails({ ...hodDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await axios.post(`${baseUrl}/api/hod/register`, hodDetails);
      alert("✅ HOD Account Created Successfully!");
      // Reset form
      setHodDetails({ name: "", email: "", branch: "", password: "" });
    } catch (error) {
      console.error("Error creating HOD:", error);
      alert("❌ Error: " + (error.response?.data || "Server Error"));
    }
  };

  return (
    <div className="admin-container">
      <h2>Create HOD Account</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={hodDetails.name}
          onChange={handleChange}
          placeholder="Enter HOD Name"
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={hodDetails.email}
          onChange={handleChange}
          placeholder="Enter Email"
          required
        />

        <label>Branch:</label>
        <select name="branch" value={hodDetails.branch} onChange={handleChange} required>
          <option value="">Select Branch</option>
          <option value="CS">CS</option>
          <option value="EC">EC</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
          <option value="AT">AT</option>
          <option value="CH">CH</option>
          <option value="EEE">EEE</option>
          <option value="PO">PO</option>
        </select>

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={hodDetails.password}
          onChange={handleChange}
          placeholder="Enter Password"
          required
        />

        <button type="submit">Create HOD</button>
      </form>
    </div>
  );
};

export default Admin;
