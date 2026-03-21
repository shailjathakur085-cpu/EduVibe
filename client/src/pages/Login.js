import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8081/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', JSON.stringify(data.role));
        
        // --- SWEETALERT SUCCESS MESSAGE ---
        Swal.fire({
          title: 'ACCESS GRANTED',
          text: `Welcome , ${data.user.name || 'User'}!`,
          icon: 'success',
          background: '#1a1a1a',
          color: '#fff',
          confirmButtonColor: '#FF5733',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });

        
        setTimeout(() => {
          navigate('/'); 
        }, 2000);

      } else {
        // --- SWEETALERT ERROR MESSAGE ---
        Swal.fire({
          title: 'Login Failed',
          text: data.message || "Invalid Email or Password",
          icon: 'error',
          background: '#1a1a1a',
          color: '#fff',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      console.error(error);
      // --- SWEETALERT SERVER ERROR ---
      Swal.fire({
        title: 'Server Error',
        text: "Backend is not responding. Is it running on port 8081?",
        icon: 'warning',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#f8bb86',
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to access your notes</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          </div>
          <button type="submit" className="auth-btn">Login</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;