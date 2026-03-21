import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import Swal from 'sweetalert2'; // --- 1. IMPORT SWEETALERT ---

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend Port 8081 Use kar rahe hain
      const res = await fetch('http://localhost:8081/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok) {
        // --- SWEET ALERT SUCCESS (DARK THEME) ---
        Swal.fire({
          title: 'Success!',
          text: 'Account Created Successfully! Please Login.',
          icon: 'success',
          background: '#1e1e1e',        // Dark Background
          color: '#ffffff',             // White Text
          iconColor: '#28a745',         // Green Icon
          confirmButtonColor: '#FF5733', // Theme Orange Color
          confirmButtonText: 'Login Now'
        }).then((result) => {
          // OK click karne ke baad hi navigate karega
          if (result.isConfirmed) {
            navigate('/login');
          }
        });

      } else {
        // --- SWEET ALERT API ERROR (DARK THEME) ---
        Swal.fire({
          title: 'Registration Failed',
          text: data.message || "Something went wrong",
          icon: 'error',
          background: '#1e1e1e',
          color: '#ffffff',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Try Again'
        });
      }
    } catch (error) {
      console.error(error);
      // --- SWEET ALERT SERVER ERROR (DARK THEME) ---
      Swal.fire({
        title: 'Server Error',
        text: "Check if backend is running on port 8081.",
        icon: 'warning',
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#FF5733'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join BCA Study & Start Learning</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          </div>
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;