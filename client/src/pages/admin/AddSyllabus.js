import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUpload, FaTrash, FaEdit, FaFilePdf, FaPlus, FaSave } from 'react-icons/fa';
import PDFViewer from '../../components/PDFViewer';
import './AddSyllabus.css';

const AddSyllabus = () => {
  // --- States ---
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [description, setDescription] = useState('');
  const [syllabusList, setSyllabusList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- Fetch Data ---
  const fetchSyllabi = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/syllabi');
      setSyllabusList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/semesters');
      setSemesterList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSyllabi();
    fetchSemesters();
  }, []);

  
  // --- File Upload ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8081/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 seconds timeout
      });
      
      console.log('Upload response:', res.data);
      setPdfUrl(`http://localhost:8081/api/pdf/${res.data.filename}`);
      alert(`File uploaded successfully!\nFilename: ${res.data.filename}\nSize: ${(res.data.size / 1024).toFixed(2)} KB`);
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'File upload failed';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout. Please try again with a smaller file.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert('Upload Error: ' + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // --- Submit (Add/Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pdfUrl) {
      alert('Please upload a PDF file or provide a PDF URL');
      return;
    }

    const url = editingId 
      ? `http://localhost:8081/api/syllabi/update/${editingId}` 
      : 'http://localhost:8081/api/syllabi/create';
    
    const method = editingId ? 'put' : 'post';

    try {
      const res = await axios({ method, url, data: { title, semester, pdfUrl, description } });
      
      if (res.status === 200 || res.status === 201) {
        alert(editingId ? "Syllabus Updated!" : "Syllabus Added!");
        setTitle('');
        setSemester('');
        setPdfUrl('');
        setDescription('');
        setEditingId(null);
        fetchSyllabi();
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Server Error"));
    }
  };

  // --- Delete ---
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this syllabus?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/syllabi/delete/${id}`);
      fetchSyllabi();
    } catch (error) {
      alert("Delete Failed");
    }
  };

  // --- Edit ---
  const handleEdit = (syllabus) => {
    setTitle(syllabus.title);
    setSemester(syllabus.semester._id);
    setPdfUrl(syllabus.pdfUrl);
    setDescription(syllabus.description || '');
    setEditingId(syllabus._id);
  };

  return (
    <div className="auth-container" style={{flexDirection:'column', padding:'40px 20px'}}>
      
      {/* --- 1. FORM SECTION --- */}
      <div className="auth-card" style={{maxWidth:'800px', width:'100%', marginBottom:'30px'}}>
        <h2 className="auth-title" style={{color:'#FF5733'}}>
          {editingId ? 'Edit Syllabus' : 'Add Syllabus'}
        </h2>
        <p className="auth-subtitle">Upload and manage syllabus PDF files for each semester</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{color:'white'}}>Syllabus Title</label>
            <input 
              type="text" 
              value={title} 
              placeholder="e.g. First Semester Syllabus 2024" 
              required 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label style={{color:'white'}}>Semester</label>
            <select 
              value={semester} 
              required 
              onChange={(e) => setSemester(e.target.value)}
              style={{width:'100%', padding:'10px', borderRadius:'5px', background:'#333', color:'white', border:'1px solid #555'}}
            >
              <option value="">Select Semester</option>
              {semesterList.map((sem) => (
                <option key={sem._id} value={sem._id}>{sem.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{color:'white'}}>PDF File Upload</label>
            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{flex:1}}
              />
              <button 
                type="button" 
                disabled={uploading}
                style={{padding:'10px', background:'#007bff', color:'white', border:'none', borderRadius:'5px', cursor:uploading?'not-allowed':'pointer'}}
              >
                {uploading ? 'Uploading...' : <FaUpload />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label style={{color:'white'}}>PDF URL (if not uploading)</label>
            <input 
              type="url" 
              value={pdfUrl} 
              placeholder="e.g. https://example.com/syllabus.pdf" 
              onChange={(e) => setPdfUrl(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label style={{color:'white'}}>Description (Optional)</label>
            <textarea 
              value={description} 
              placeholder="Brief description of the syllabus..."
              rows="3"
              onChange={(e) => setDescription(e.target.value)}
              style={{width:'100%', padding:'10px', borderRadius:'5px', background:'#333', color:'white', border:'1px solid #555', resize:'vertical'}}
            />
          </div>
          
          <button type="submit" className="auth-btn" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
             {editingId ? <FaSave /> : <FaPlus />} 
             {editingId ? "Update Syllabus" : "Create Syllabus"}
          </button>

          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setTitle(''); setSemester(''); setPdfUrl(''); setDescription(''); }}
              style={{marginTop:'10px', background:'gray', color:'white', padding:'10px', border:'none', borderRadius:'5px', width:'100%', cursor:'pointer'}}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* --- 2. TABLE SECTION --- */}
      <div className="auth-card" style={{maxWidth:'800px', width:'100%'}}>
        <h3 style={{color:'white', borderBottom:'1px solid #333', paddingBottom:'15px', marginBottom:'20px'}}>
          Existing Syllabi
        </h3>

        {syllabusList.length === 0 ? (
          <p style={{color:'#888', textAlign:'center'}}>No syllabi added yet.</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', color:'white', textAlign:'left'}}>
              <thead>
                <tr style={{borderBottom:'2px solid #555', color:'#FF5733'}}>
                  <th style={{padding:'10px'}}>Title</th>
                  <th style={{padding:'10px'}}>Semester</th>
                  <th style={{padding:'10px'}}>Description</th>
                  <th style={{padding:'10px', textAlign:'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {syllabusList.map((syllabus) => (
                  <tr key={syllabus._id} style={{borderBottom:'1px solid #333'}}>
                    <td style={{padding:'12px', fontWeight:'bold'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <FaFilePdf color="#dc3545" />
                        {syllabus.title}
                      </div>
                    </td>
                    <td style={{padding:'12px'}}>{syllabus.semester?.name || 'N/A'}</td>
                    <td style={{padding:'12px', color:'#ccc'}}>
                      {syllabus.description ? (syllabus.description.length > 50 ? syllabus.description.substring(0, 50) + '...' : syllabus.description) : 'No description'}
                    </td>
                    <td style={{padding:'12px', textAlign:'right', display:'flex', justifyContent:'flex-end', gap:'10px'}}>
                      
                      {/* View PDF Button */}
                      <button 
                        onClick={() => setViewingPdf({ url: syllabus.pdfUrl, title: syllabus.title })}
                        style={{background:'#28a745', color:'white', border:'none', padding:'8px 12px', borderRadius:'5px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'5px'}}
                      >
                        <FaFilePdf /> View
                      </button>

                      {/* Edit Button */}
                      <button onClick={() => handleEdit(syllabus)} style={{background:'#007bff', color:'white', border:'none', padding:'8px 12px', borderRadius:'5px', cursor:'pointer'}}>
                        <FaEdit />
                      </button>

                      {/* Delete Button */}
                      <button onClick={() => handleDelete(syllabus._id)} style={{background:'#dc3545', color:'white', border:'none', padding:'8px 12px', borderRadius:'5px', cursor:'pointer'}}>
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

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <PDFViewer 
          pdfUrl={viewingPdf.url}
          title={viewingPdf.title}
          onClose={() => setViewingPdf(null)}
        />
      )}

    </div>
  );
};

export default AddSyllabus;
