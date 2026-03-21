import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaSave, FaPlus } from 'react-icons/fa';
import '../Auth.css'; // Same Theme CSS
import axios from 'axios';

const AddSemester = () => {
  // --- States ---
  const [name, setName] = useState('');
  const [semesterList, setSemesterList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // --- Fetch Data ---
  const fetchSemesters = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/semesters');
      setSemesterList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  // --- Submit (Add/Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingId 
      ? `http://localhost:8081/api/semesters/update/${editingId}` 
      : 'http://localhost:8081/api/semesters/create';
    
    const method = editingId ? 'put' : 'post';

    try {
      const res = await axios({ method, url, data: { name } });
      
      if (res.status === 200 || res.status === 201) {
        alert(editingId ? "Semester Updated!" : "Semester Added!");
        setName('');
        setEditingId(null);
        fetchSemesters(); // Table Refresh
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Server Error"));
    }
  };

  // --- Delete ---
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this semester?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/semesters/delete/${id}`);
      fetchSemesters();
    } catch (error) {
      alert("Delete Failed");
    }
  };

  // --- Edit ---
  const handleEdit = (sem) => {
    setName(sem.name);
    setEditingId(sem._id);
  };

  return (
    <div className="auth-container" style={{flexDirection:'column', padding:'40px 20px'}}>
      
      {/* --- 1. FORM SECTION --- */}
      <div className="auth-card" style={{maxWidth:'800px', width:'100%', marginBottom:'30px'}}>
        <h2 className="auth-title" style={{color:'#FF5733'}}>
          {editingId ? 'Edit Semester' : 'Add Semester'}
        </h2>
        <p className="auth-subtitle">Create semesters for the course (e.g. First Semester)</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{color:'white'}}>Semester Name</label>
            <input 
              type="text" 
              value={name} 
              placeholder="e.g. First Semester" 
              required 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          
          <button type="submit" className="auth-btn" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
             {editingId ? <FaSave /> : <FaPlus />} 
             {editingId ? "Update Semester" : "Create Semester"}
          </button>

          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setName('') }}
              style={{marginTop:'10px', background:'gray', color:'white', padding:'10px', border:'none', borderRadius:'5px', width:'100%', cursor:'pointer'}}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* --- 2. TABLE SECTION --- */}
      <div className="auth-card" style={{maxWidth:'800px', width:'100%'}}>
        <h3 style={{color:'white', borderBottom:'1px solid #333', paddingBottom:'15px', marginBottom:'20px'}}>
          Existing Semesters
        </h3>

        {semesterList.length === 0 ? (
          <p style={{color:'#888', textAlign:'center'}}>No semesters added yet.</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', color:'white', textAlign:'left'}}>
              <thead>
                <tr style={{borderBottom:'2px solid #555', color:'#FF5733'}}>
                  <th style={{padding:'10px'}}>Semester Name</th>
                  <th style={{padding:'10px', textAlign:'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {semesterList.map((sem) => (
                  <tr key={sem._id} style={{borderBottom:'1px solid #333'}}>
                    <td style={{padding:'12px', fontWeight:'bold'}}>{sem.name}</td>
                    <td style={{padding:'12px', textAlign:'right', display:'flex', justifyContent:'flex-end', gap:'10px'}}>
                      
                      {/* Edit Button */}
                      <button onClick={() => handleEdit(sem)} style={{background:'#007bff', color:'white', border:'none', padding:'8px 12px', borderRadius:'5px', cursor:'pointer'}}>
                        <FaEdit />
                      </button>

                      {/* Delete Button */}
                      <button onClick={() => handleDelete(sem._id)} style={{background:'#dc3545', color:'white', border:'none', padding:'8px 12px', borderRadius:'5px', cursor:'pointer'}}>
                        <FaTrash />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AddSemester;