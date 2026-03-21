import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaSave, FaPlus } from 'react-icons/fa';
import '../Auth.css'; 
import axios from 'axios'; 
import Swal from 'sweetalert2'; // 1. SweetAlert import kiya

const AddSubject = () => {
  // --- STATES ---
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semesterId: '',
    keyTopics: []
  });

  const [subjectsList, setSubjectsList] = useState([]); 
  const [semestersList, setSemestersList] = useState([]); 
  const [editingId, setEditingId] = useState(null);
  const [currentTopic, setCurrentTopic] = useState('');

  // --- STANDARD LIST (Fallback) ---
  const standardSemesters = [
    { _id: "1", name: "First Semester" },
    { _id: "2", name: "Second Semester" },
    { _id: "3", name: "Third Semester" },
    { _id: "4", name: "Fourth Semester" },
    { _id: "5", name: "Fifth Semester" },
    { _id: "6", name: "Sixth Semester" }
  ];

  // --- 1. FETCH SEMESTERS ---
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await axios.get('http://localhost:8081/api/semesters');
        if (res.data && res.data.length > 0) {
            setSemestersList(res.data);
        } else {
            setSemestersList(standardSemesters);
        }
      } catch (error) {
        setSemestersList(standardSemesters);
      }
    };
    fetchSemesters();
  }, []); 

  // --- 2. FETCH SUBJECTS ---
  const fetchSubjects = async () => {
    try {
      const url = formData.semesterId 
        ? `http://localhost:8081/api/subjects/semester/${formData.semesterId}`
        : 'http://localhost:8081/api/subjects/';
      
      const res = await axios.get(url);
      setSubjectsList(res.data);
    } catch (error) {
      setSubjectsList([]); 
    }
  };

  useEffect(() => {
    if(formData.semesterId) fetchSubjects();
  }, [formData.semesterId]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Key Topics Handlers ---
  const addTopic = () => {
    if (currentTopic.trim() && !formData.keyTopics.includes(currentTopic.trim())) {
      setFormData({
        ...formData,
        keyTopics: [...formData.keyTopics, currentTopic.trim()]
      });
      setCurrentTopic('');
    }
  };

  const removeTopic = (topicToRemove) => {
    setFormData({
      ...formData,
      keyTopics: formData.keyTopics.filter(topic => topic !== topicToRemove)
    });
  };

  const handleTopicKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTopic();
    }
  };

  // --- Auto-suggest topics based on subject name ---
  const getSuggestedTopics = (subjectName) => {
    const topicMap = {
      'c programming': ['Introduction to C', 'Data Types', 'Operators', 'Control Flow', 'Functions', 'Arrays', 'Pointers', 'Structures'],
      'c++': ['Introduction to C++', 'Classes and Objects', 'Inheritance', 'Polymorphism', 'Templates', 'STL', 'File Handling'],
      'java': ['Java Basics', 'OOP Concepts', 'Exception Handling', 'Collections', 'Multithreading', 'JDBC', 'Servlets'],
      'data structure': ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Sorting Algorithms', 'Searching Algorithms'],
      'algorithm': ['Algorithm Analysis', 'Sorting', 'Searching', 'Dynamic Programming', 'Greedy Algorithms', 'Graph Algorithms'],
      'database': ['DBMS Concepts', 'SQL', 'Normalization', 'Transactions', 'Indexes', 'PL/SQL', 'NoSQL'],
      'web development': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'PHP', 'Bootstrap'],
      'mathematics': ['Calculus', 'Linear Algebra', 'Probability', 'Statistics', 'Discrete Mathematics'],
      'computer networks': ['OSI Model', 'TCP/IP', 'Network Protocols', 'Security', 'Wireless Networks'],
      'operating system': ['Process Management', 'Memory Management', 'File Systems', 'Scheduling', 'Deadlocks']
    };

    const lowerName = subjectName.toLowerCase();
    
    for (const [key, topics] of Object.entries(topicMap)) {
      if (lowerName.includes(key)) {
        return topics;
      }
    }
    
    return [];
  };

  const addSuggestedTopic = (topic) => {
    if (!formData.keyTopics.includes(topic)) {
      setFormData({
        ...formData,
        keyTopics: [...formData.keyTopics, topic]
      });
    }
  };

  const suggestedTopics = getSuggestedTopics(formData.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.semesterId) {
      // Custom Error Alert
      Swal.fire({
        icon: 'warning',
        title: 'Selection Required',
        text: 'Please select a semester first!',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#FF5733'
      });
      return;
    }

    const url = editingId 
      ? `http://localhost:8081/api/subjects/update/${editingId}`
      : 'http://localhost:8081/api/subjects/';
    
    const method = editingId ? 'put' : 'post';

    try {
      const res = await axios({ method, url, data: formData });

      if (res.status === 200 || res.status === 201) {
        // --- SUCCESS ALERT ---
        Swal.fire({
          icon: 'success',
          title: editingId ? 'Subject Updated!' : 'Subject Added!',
          background: '#1a1a1a',
          color: '#fff',
          confirmButtonColor: '#FF5733',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'glass-popup' }
        });

        setFormData({ name: '', code: '', semesterId: formData.semesterId, keyTopics: [] }); 
        setCurrentTopic('');
        setEditingId(null);
        fetchSubjects(); 
      }
    } catch (error) {
      // --- DATABASE ERROR ALERT ---
      Swal.fire({
        icon: 'error',
        title: 'Execution Failed',
        text: "Database me ye Semester ID exist nahi karti. Pehle 'Add Semester' page par Real Semester create karein.",
        background: '#1a1a1a',
        color: '#fff'
      });
    }
  };

  const handleDelete = async (id) => {
    // --- CONFIRMATION ALERT ---
    Swal.fire({
      title: 'Delete Subject?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#1a1a1a',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8081/api/subjects/delete/${id}`);
          fetchSubjects(); 
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            background: '#1a1a1a',
            color: '#fff',
            timer: 1000,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire('Error', 'Failed to delete', 'error');
        }
      }
    });
  };

  const handleEdit = (subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      semesterId: subject.semesterId,
      keyTopics: subject.keyTopics || []
    });
    setEditingId(subject._id); 
    window.scrollTo(0, 0); 
  };

  return (
    <div className="auth-container" style={{flexDirection: 'column', padding:'40px 20px'}}>
      
      <div className="auth-card" style={{maxWidth: '800px', width: '100%', marginBottom: '40px'}}>
        <h2 className="auth-title" style={{color:'#FF5733'}}>
          {editingId ? 'Edit Subject' : 'Add Subject'}
        </h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label style={{color:'white', float:'left'}}>Select Semester</label>
            <select 
              name="semesterId" 
              value={formData.semesterId} 
              onChange={handleChange}
              required
              style={{
                width:'100%', 
                padding:'12px', 
                borderRadius:'8px', 
                background:'#fff',
                color:'#000',
                border:'1px solid #333', 
                cursor:'pointer',
                fontSize: '16px'
              }}
            >
              <option value="" style={{color: '#888'}}>-- Select a Semester --</option>
              {semestersList.map((sem) => (
                <option key={sem._id} value={sem._id} style={{color:'black'}}>
                  {sem.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{color:'white', float:'left'}}>Subject Name</label>
            <input type="text" name="name" value={formData.name} placeholder="e.g. Mathematics-I" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label style={{color:'white', float:'left'}}>Subject Code</label>
            <input type="text" name="code" value={formData.code} placeholder="e.g. BCA-101" onChange={handleChange} />
          </div>

         

          <button type="submit" className="auth-btn" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
            {editingId ? <FaSave /> : <FaPlus />} 
            {editingId ? "Update Subject" : "Save Subject"}
          </button>

          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({...formData, name:'', code:'', keyTopics: []}); setCurrentTopic(''); }}
              style={{marginTop:'10px', background:'gray', color:'white', padding:'10px', border:'none', borderRadius:'5px', width:'100%', cursor:'pointer'}}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="auth-card" style={{maxWidth: '800px', width: '100%'}}>
        <h3 style={{color:'white', borderBottom:'1px solid #333', paddingBottom:'15px', marginBottom:'20px'}}>
          Subjects List
        </h3>

        {subjectsList.length === 0 ? (
          <p style={{color:'#888', textAlign:'center'}}>No subjects found.</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', color:'white', textAlign:'left'}}>
              <thead>
                <tr style={{borderBottom:'2px solid #555', color:'#FF5733'}}>
                  <th style={{padding:'10px'}}>Code</th>
                  <th style={{padding:'10px'}}>Name</th>
                  {/* <th style={{padding:'10px'}}>Key Topics</th> */}
                  <th style={{padding:'10px', textAlign:'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjectsList.map((sub) => (
                  <tr key={sub._id} style={{borderBottom:'1px solid #333'}}>
                    <td style={{padding:'12px', color:'#aaa'}}>{sub.code || 'N/A'}</td>
                    <td style={{padding:'12px', fontWeight:'bold'}}>{sub.name}</td>
                    <td style={{padding:'12px'}}>
                      {sub.keyTopics && sub.keyTopics.length > 0 ? (
                        <div style={{display:'flex', flexWrap:'wrap', gap:'4px'}}>
                          {sub.keyTopics.map((topic, index) => (
                            <span 
                              key={index}
                              style={{
                                background: '#FF5733',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'normal'
                              }}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{color:'#888', fontStyle:'italic'}}></span>
                      )}
                    </td>
                    <td style={{padding:'12px', textAlign:'right'}}>
                      <button onClick={() => handleEdit(sub)} style={{marginRight:'10px', background:'none', border:'none', color:'#007bff', cursor:'pointer'}}><FaEdit /></button>
                      <button onClick={() => handleDelete(sub._id)} style={{background:'none', border:'none', color:'#dc3545', cursor:'pointer'}}><FaTrash /></button>
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

export default AddSubject;