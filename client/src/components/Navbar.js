import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import {
  FaGraduationCap,
  FaChevronDown,
  FaSignOutAlt,
  FaCogs,
} from "react-icons/fa"; 
import "./Navbar.css";
import Swal from 'sweetalert2'; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.warn("localStorage access blocked:", error);
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session!",
      icon: 'warning',
      showCancelButton: true,
      background: '#1a1a1a', 
      color: '#fff',
      confirmButtonColor: '#FF5733', 
      cancelButtonColor: '#444',
      confirmButtonText: 'Yes, Logout!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'glass-popup',
        confirmButton: 'btn-neon-swal'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role"); 
        } catch (error) {
          console.warn("localStorage access blocked during logout:", error);
        }
        setUser(null);

        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          background: '#1a1a1a',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });

        navigate("/login");
      }
    });
  };

  return (
    <nav className="navbar">
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <FaGraduationCap className="logo-icon" />
        <h2>EduVibe</h2>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>

        {/* --- UPDATED DROPDOWN: COMPUTER SCIENCE --- */}
        <li className="dropdown">
          <span>Computer Science <FaChevronDown size={12} /></span>
          <div className="dropdown-content">
            <Link to="/cs/section-1">Section 1</Link>
            <Link to="/cs/section-2">Section 2</Link>
            <Link to="/cs/section-3">Section 3</Link>
          </div>
        </li>

        {/* Dropdown 2: Programs */}
        <li className="dropdown">
          <span>Programs <FaChevronDown size={12} /></span>
          <div className="dropdown-content">
            <Link to="/programs/c">C</Link>
            <Link to="/programs/cpp">C++</Link>
            <Link to="/programs/java">Java</Link>
            <Link to="/programs/dsa">DSA</Link>
            <Link to="/notes">Notes</Link>
          </div>
        </li>

        {/* MANAGEMENT DROPDOWN (ADMIN ONLY) */}
        {user && user.role === "admin" && (
          <li className="dropdown">
            <span style={{ color: "#FF5733", fontWeight: "bold" }}>
              Management <FaCogs size={14} style={{ marginLeft: "5px" }} />
            </span>
            <div className="dropdown-content">
              <Link to="/admin/add-subject">Add Subject</Link>
              <Link to="/admin/add-program">Add Program</Link>
              <Link to="/admin/add-semester">Add Semester</Link>
              <Link to="/admin/add-syllabus">Add Syllabus</Link>
              <Link to="/admin/add-note">Add Note</Link>
            </div>
          </li>
        )}

        <li><Link to="/quiz">QUIZ</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      <div className="auth-buttons">
        {user ? (
          <div className="user-profile-section" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ color: "white", fontWeight: "bold" }}>
              Hi, {user.name ? user.name.split(" ")[0] : "User"}
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout <FaSignOutAlt style={{ marginLeft: "5px" }} />
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;