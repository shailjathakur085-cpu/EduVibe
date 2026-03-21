import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaSave, FaPlus } from 'react-icons/fa'; 
import '../Auth.css'; 
import axios from 'axios'; 
import Swal from 'sweetalert2'; // --- 1. IMPORT SWEETALERT HERE ---

const AddProgram = () => {
  // --- 1. STATES ---
  const [formData, setFormData] = useState({
    title: '',
    language: 'c',
    code: '',
    output: ''
  });

  const [programsList, setProgramsList] = useState([]); 
  const [editingId, setEditingId] = useState(null); 

  // --- 2. FETCH DATA ---
  const fetchPrograms = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/programs/${formData.language}`);
      setProgramsList(res.data);
    } catch (error) {
      console.error("Error fetching programs", error);
      setProgramsList([]);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [formData.language]);

  // --- 3. INPUT HANDLER ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 4. SUBMIT HANDLER (Updated with Dark SweetAlert) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingId 
      ? `http://localhost:8081/api/programs/update/${editingId}`
      : 'http://localhost:8081/api/programs/add';
    
    const method = editingId ? 'put' : 'post';

    try {
      const res = await axios({
        method: method,
        url: url,
        data: formData,
      });

      if (res.status === 200 || res.status === 201) {
        // --- SWEET ALERT SUCCESS (DARK THEME) ---
        Swal.fire({
          title: 'Success!',
          text: editingId ? "Program Updated Successfully!" : "Program Added Successfully!",
          icon: 'success',
          background: '#1e1e1e',   // Dark Background
          color: '#ffffff',        // White Text
          iconColor: '#28a745',    // Green Icon
          confirmButtonColor: '#FF5733', // Orange Button
          confirmButtonText: 'OK'
        });
        
        // Reset Form
        setFormData({ title: '', language: formData.language, code: '', output: '' });
        setEditingId(null);
        fetchPrograms(); 
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response && error.response.data && error.response.data.error 
        ? error.response.data.error 
        : "Server Error";
      
      // --- SWEET ALERT ERROR (DARK THEME) ---
      Swal.fire({
        title: 'Error!',
        text: errorMsg,
        icon: 'error',
        background: '#1e1e1e',   // Dark Background
        color: '#ffffff',        // White Text
        confirmButtonColor: '#d33',
        confirmButtonText: 'Try Again'
      });
    }
  };

  // --- 5. DELETE FUNCTION (Updated with Dark SweetAlert) ---
  const handleDelete = async (id) => {
    // Delete confirm ko bhi Dark Mode kar diya hai taaki theme match kare
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      background: '#1e1e1e',         // Dark Background
      color: '#ffffff',              // White Text
      confirmButtonColor: '#d33',    // Red for delete
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8081/api/programs/delete/${id}`);
          fetchPrograms(); 
          
          Swal.fire({
            title: 'Deleted!',
            text: 'Your program has been deleted.',
            icon: 'success',
            background: '#1e1e1e',
            color: '#ffffff',
            confirmButtonColor: '#FF5733'
          });
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Error deleting program',
            icon: 'error',
            background: '#1e1e1e',
            color: '#ffffff'
          });
        }
      }
    });
  };

  // --- 6. EDIT FUNCTION ---
  const handleEdit = (program) => {
    setFormData({
      title: program.title,
      language: program.language,
      code: program.code,
      output: program.output
    });
    setEditingId(program._id); 
    window.scrollTo(0, 0); 
  };

  return (
    <div className="auth-container" style={{flexDirection: 'column', padding:'40px 20px'}}>
      
      {/* --- FORM SECTION --- */}
      <div className="auth-card" style={{maxWidth: '800px', width: '100%', marginBottom: '40px'}}>
        <h2 className="auth-title" style={{color:'#FF5733'}}>
          {editingId ? 'Edit Program' : 'Add New Program'}
        </h2>
        <p className="auth-subtitle">Add code examples for students</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label style={{color:'white', float:'left'}}>Program Title</label>
            <input type="text" name="title" value={formData.title} placeholder="e.g. Factorial using Loop" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label style={{color:'white', float:'left'}}>Select Language</label>
            <select 
              name="language" value={formData.language} onChange={handleChange}
              style={{width:'100%', padding:'12px', borderRadius:'8px', background:'#1e1e1e', color:'white', border:'1px solid #333'}}
            >
              <option value="c">C Programming</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="dsa">DSA</option>   
              <option value="sql">SQL</option>
              {/* <option value="notes">Notes</option> */}
            </select>
          </div>

          <div className="form-group">
            <label style={{color:'white', float:'left'}}>Source Code</label>
            <textarea name="code" value={formData.code} placeholder="#include <stdio.h>..." required onChange={handleChange} rows="8"
              style={{width:'100%', padding:'12px', borderRadius:'8px', background:'#1e1e1e', color:'#0f0', border:'1px solid #333', fontFamily:'monospace'}}
            />
          </div>

          <div className="form-group">
            <label style={{color:'white', float:'left'}}>Expected Output</label>
            <textarea name="output" value={formData.output} placeholder="Output: 120" onChange={handleChange} rows="3"
              style={{width:'100%', padding:'12px', borderRadius:'8px', background:'#1e1e1e', color:'yellow', border:'1px solid #333', fontFamily:'monospace'}}
            />
          </div>

          <button type="submit" className="auth-btn" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
            {editingId ? <FaSave /> : <FaPlus />} 
            {editingId ? "Update Program" : "Save Program"}
          </button>

          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({...formData, title:'', code:'', output:''}) }}
              style={{marginTop:'10px', background:'gray', color:'white', padding:'10px', border:'none', borderRadius:'5px', cursor:'pointer', width:'100%'}}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="auth-card" style={{maxWidth: '800px', width: '100%'}}>
        <h3 style={{color:'white', borderBottom:'1px solid #333', paddingBottom:'15px', marginBottom:'20px'}}>
          Existing {formData.language.toUpperCase()} Programs
        </h3>

        {programsList.length === 0 ? (
          <p style={{color:'#888', textAlign:'center'}}>No programs added yet.</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', color:'white', textAlign:'left'}}>
              <thead>
                <tr style={{borderBottom:'2px solid #555', color:'#FF5733'}}>
                  <th style={{padding:'10px'}}>Title</th>
                  <th style={{padding:'10px', textAlign:'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programsList.map((prog) => (
                  <tr key={prog._id} style={{borderBottom:'1px solid #333'}}>
                    <td style={{padding:'12px'}}>{prog.title}</td>
                    <td style={{padding:'12px', textAlign:'right', display:'flex', justifyContent:'flex-end', gap:'10px'}}>
                      <button onClick={() => handleEdit(prog)} style={{background:'#007bff', color:'white', border:'none', padding:'8px 12px', borderRadius:'5px', cursor:'pointer'}}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(prog._id)} style={{background:'#dc3545', color:'white', border:'none', padding:'8px 12px', borderRadius:'5px', cursor:'pointer'}}>
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

export default AddProgram;