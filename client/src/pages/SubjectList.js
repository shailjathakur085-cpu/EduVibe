import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SubjectList.css'; // CSS file agar banayi ho to

const SubjectList = () => {
  const { semId } = useParams(); // URL se Semester ki ID milegi
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- API CALL ---
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // Port 8081 use kar rahe hain
        const res = await axios.get(`http://localhost:8081/api/subjects/semester/${semId}`);
        setSubjects(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [semId]);

  if (loading) return <div className="detail-page" style={{color:'white'}}><h1>Loading Subjects...</h1></div>;

  return (
    <div className="detail-page">
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="semester-header">
        <h1 style={{color:'white'}}>Subjects List</h1>
        <p style={{color:'gray'}}>Select a subject to view notes</p>
      </div>

      <div className="subject-grid">
        {subjects.length > 0 ? (
          subjects.map((sub) => (
            <button 
              key={sub._id} 
              className="subject-card"
              // Hum subject ka naam bhej rahe hain taaki ChapterDetail wahi open kare
              onClick={() => navigate(`/chapter/${sub.name}`)} 
            >
              <h3>{sub.name}</h3>
              {sub.code && <span style={{fontSize:'0.8rem', color:'gray'}}>{sub.code}</span>}
            </button>
          ))
        ) : (
          <h3 style={{color:'white'}}>No subjects found in database for this semester.</h3>
        )}
      </div>
    </div>
  );
};

export default SubjectList;