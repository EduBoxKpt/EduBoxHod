// src/pages/header/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "./logo.png";

const Header = ({ isHodLoggedIn, setIsHodLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("hodToken");
    localStorage.removeItem("hodBranch");
    setIsHodLoggedIn(false); // Update global state
    alert("Logged out successfully!");
    navigate("/hodlogin");
  };


  

  return (
    <header className="main-header">
      <div className="header-logo-section">
        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="Logo" className="header-logo" />
        </Link>
        <Link to="/" className="header-site-name" onClick={closeMenu}>
          EduBox
        </Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`header-nav ${isMenuOpen ? "active" : ""}`}>
        <Link to="/" className="header-nav-link" onClick={closeMenu}>
          Home
        </Link>

        {isHodLoggedIn ? (
          <>
            <Link to="/adminnotes" className="header-nav-link" onClick={closeMenu}>
              Notes
            </Link>
            <Link to="/adminqp" className="header-nav-link" onClick={closeMenu}>
              Question Paper
            </Link>
            
<Link to="/about" className="header-nav-link" onClick={closeMenu}>About</Link>

<Link to="/admin" className="header-nav-link" onClick={closeMenu}>Admin Page</Link>
<Link to="/contact" className="header-nav-link" onClick={closeMenu}>Contact Us</Link> 
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
          <Link to="/hodlogin" className="header-nav-link" onClick={closeMenu}>
            HOD Login
          </Link>
<Link to="/about" className="header-nav-link" onClick={closeMenu}>About</Link>

<Link to="/admin" className="header-nav-link" onClick={closeMenu}>Admin Page</Link>
<Link to="/contact" className="header-nav-link" onClick={closeMenu}>Contact Us</Link> 

</>
        )}

        
      </nav>
    </header>
  );
};

export default Header;
