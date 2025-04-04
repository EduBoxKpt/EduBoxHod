// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./pages/header/Header";
import Footer from "./pages/footer/Footer";
import Home from "./pages/home/Home";


import About from "./pages/About/About";
import ContactUs from "./pages/Contact/Contact";

import QuestionPaperAdmin from "./pages/QuestionPapers/QuestionPaperAdmin";
import Hodlogin from "./pages/Hodlogin/Hodlogin";
import Admin from "./pages/Admin/Admin";
import NotesAdmin from "./pages/Notes/NotesAdmin";

import ProtectedRoute from "./pages/Hodlogin/ProtectedRoute";


const App = () => {
  // Manage HOD login state globally
  const [isHodLoggedIn, setIsHodLoggedIn] = useState(null);

  // Check login status on mount
  useEffect(() => {
    const hodToken = localStorage.getItem("hodToken");
    setIsHodLoggedIn(!!hodToken);
  }, []);


  if (isHodLoggedIn === null) {
    return <div>Loading...</div>; // You can replace this with a proper loader
  }

  return (
    <Router>
      <Header isHodLoggedIn={isHodLoggedIn} setIsHodLoggedIn={setIsHodLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/hodlogin" element={<Hodlogin setIsHodLoggedIn={setIsHodLoggedIn} />} />
        <Route path="/admin" element={<Admin />} />

        {/* 🔒 Protect these routes */}
        <Route
          path="/adminnotes"
          element={
            <ProtectedRoute isHodLoggedIn={isHodLoggedIn}>
              <NotesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminqp"
          element={
            <ProtectedRoute isHodLoggedIn={isHodLoggedIn}>
              <QuestionPaperAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
