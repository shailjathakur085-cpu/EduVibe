import React, { useState } from 'react';
import '../Auth.css'; // Same Dark Theme CSS

const AddStream = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8081/api/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      
      if (res.ok) {
        alert("Stream Added Successfully! (e.g. " + data.data.name + ")");
        setName(''); // Clear input
      } else {
        alert("Error: " + (data.message || "Failed to add stream"));
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title" style={{color:'#FF5733'}}>Add Stream</h2>
        <p className="auth-subtitle">Create new courses like BCA, BBA, BTech</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <input 
              type="text" 
              name="name" 
              value={name} 
              placeholder="Stream Name (e.g. BCA)" 
              required 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <button type="submit" className="auth-btn">Create Stream</button>
        </form>
      </div>
    </div>
  );
};

export default AddStream;