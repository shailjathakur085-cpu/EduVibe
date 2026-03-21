import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Semester.css';
import { 
  FaLaptopCode, FaDesktop, FaComments, FaSitemap, FaBook, 
  FaCalculator, FaSearch, FaArrowLeft, FaDatabase, 
  FaMobileAlt, FaGlobe, FaShieldAlt, FaDownload, FaFilePdf
} from 'react-icons/fa';

const Semester = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [semesterName, setSemesterName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- NEW ADDITION: Syllabus Links ---
  const syllabusLinks = {
    "1": "https://example.com/sem1-syllabus.pdf",
    "2": "https://example.com/sem2-syllabus.pdf",
    "3": "https://example.com/sem3-syllabus.pdf",
    "4": "https://example.com/sem4-syllabus.pdf",
    "5": "https://example.com/sem5-syllabus.pdf",
    "6": "https://example.com/sem6-syllabus.pdf"
  };

  // --- 1. DOWNLOAD LOGIC (Har Subject ke liye) ---
  // const handleDownloadSubject = (subjectTitle) => {
  //   const user = localStorage.getItem('user'); // Check Login

  //   if (!user) {
  //     // Agar Login NAHI hai -> Redirect
  //     if(window.confirm("🔒 You need to Login to Download the Syllabus for " + subjectTitle + "!\nGo to Login Page?")) {
  //       navigate('/login');
  //     }
  //   } else {
  //     // Agar Login HAI -> Download Start
  //     alert(`⬇️ Downloading Syllabus for: ${subjectTitle}`);
      
  //     // (Yahan future mein aap Backend se aayi PDF URL laga sakte hain)
  //     const link = document.createElement('a');
  //     link.href = '#'; 
  //     link.setAttribute('download', `${subjectTitle}_Syllabus.pdf`);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };
  // --- 1. DOWNLOAD LOGIC (Updated for Special Characters) ---
  const handleDownloadSubject = async (subjectTitle) => {
    const user = localStorage.getItem('user'); 

    if (!user) {
      if(window.confirm("🔒 Login required to download " + subjectTitle + "!\nGo to Login Page?")) {
        navigate('/login');
      }
    } else {
      try {
        // First, try to get the syllabus data from database
        const response = await fetch(`http://localhost:8081/api/syllabi`);
        const syllabi = await response.json();
        
        // Find the syllabus for this subject
        const syllabus = syllabi.find(s => s.title.toLowerCase() === subjectTitle.toLowerCase());
        
        let pdfPath;
        if (syllabus && syllabus.pdfUrl) {
          // Use the PDF URL from database
          pdfPath = syllabus.pdfUrl;
        } else {
          // Fallback: try to construct the path (for backward compatibility)
          const safeFilename = encodeURIComponent(subjectTitle);
          pdfPath = `http://localhost:8081/uploads/${safeFilename}.pdf`;
        }

        console.log("Downloading from:", pdfPath); 

        const link = document.createElement('a');
        link.href = pdfPath; 
        link.setAttribute('target', '_blank');
        link.setAttribute('download', `${subjectTitle}_Syllabus.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading syllabus:', error);
        alert('Syllabus not found. Please contact admin.');
      }
    }
  };
  // ------------------------------------------------

  // --- 2. DOWNLOAD LOGIC (Pure Semester ke liye) ---
  // --- 1. DOWNLOAD LOGIC (Har Subject ke liye) ---
  // const handleDownloadSyllabus = (subjectTitle) => {
  //   const user = localStorage.getItem('user'); // Check Login

  //   if (!user) {
  //     // Agar Login NAHI hai -> Redirect
  //     if(window.confirm("🔒 You need to Login to Download the Syllabus for " + subjectTitle + "!\nGo to Login Page?")) {
  //       navigate('/login');
  //     }
  //   } else {
  //     // Agar Login HAI -> Download Start
  //     // alert(`⬇️ Downloading Syllabus for: ${subjectTitle}`); // Alert hata sakte hain agar direct download chahiye
      
  //     const link = document.createElement('a');
      
  //     // --- YAHAN CHANGE KIYA HAI ---
  //     // Ye public folder ke andar syllabus folder mein file dhundega
  //     link.href = `/syllabus/${subjectTitle}.pdf`; 
  //     // -----------------------------

  //     link.setAttribute('download', `${subjectTitle}_Syllabus.pdf`); // Downloaded file ka naam
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };
  // const handleDownloadSyllabus = () => {
  //   const user = localStorage.getItem('user'); 
  //   if (!user) {
  //     if(window.confirm("🔒 You need to Login to Download the Semester Syllabus!\nGo to Login Page?")) {
  //       navigate('/login');
  //     }
  //   } else {
  //     const link = document.createElement('a');
  //     link.href = syllabusLinks[id]; 
  //     link.setAttribute('target', '_blank');
  //     link.setAttribute('download', `${semesterName}_Semester_Syllabus.pdf`);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

  const getIcon = (subjectName) => {
    const name = subjectName ? subjectName.toLowerCase() : "";
    if (name.includes('c++') || name.includes('java') || name.includes('python') || name.includes('programming')) return <FaLaptopCode />;
    if (name.includes('web') || name.includes('internet') || name.includes('cloud')) return <FaGlobe />;
    if (name.includes('data') || name.includes('dbms') || name.includes('sql')) return <FaDatabase />;
    if (name.includes('mobile') || name.includes('android')) return <FaMobileAlt />;
    if (name.includes('security')) return <FaShieldAlt />;
    if (name.includes('math') || name.includes('stats')) return <FaCalculator />;
    if (name.includes('communication')) return <FaComments />;
    if (name.includes('management') || name.includes('business')) return <FaSitemap />;
    if (name.includes('fundamental') || name.includes('digital') || name.includes('computer')) return <FaDesktop />;
    return <FaBook />;
  };

  useEffect(() => {
  window.scrollTo(0, 0);
const semListNames = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];
    
    // Agar URL ID '1' hai toh "First Semester" set karega
    if (!isNaN(id) && id.length < 5) {
        setSemesterName(semListNames[id - 1] || `${id}th`);
    }
  // --- PURANA DATA (UDANA NAHI HAI) ---
  const allSemestersData = {
      "1": [
          { title: "Programming Principle & Algorithm", units: ["C-Programming", "Control Flow", "Arrays & Strings", "Functions"] },
          { title: "Fundamental of Management", units: ["principle of management", "Planning", "Organizing", "Staffing"] },
          { title: "Business Communication", units: ["Business", "Letter Writing", "Presentation Skills", "Barriers"] },
          { title: "Mathematics - I", units: ["Mathematics", "Matrices", "Limits", "Differentiation"] }
      ],
      "2": [
          { title: "Object Oriented Programming", units: ["C++ Programming", "Classes & Objects", "Inheritance", "Polymorphism"] },
          { title: "Digital Electronics", units: ["Digital Logic", "Boolean Algebra", "Flip Flops", "Number Systems"] },
          { title: "Mathematics - II", units: ["Discrete Mathematics", "Graph Theory", "Sets & Relations", "Trees"] },
          { title: "Financial Accounting", units: ["Accounting Principles", "Journal & Ledger", "Balance Sheet", "Tally"] }
      ],
      "3": [
          { title: "Database Management System", units: ["DBMS Concepts", "SQL Queries", "Normalization", "ER Modeling"] },
          { title: "Operating Systems", units: ["OS Introduction", "Process Mgmt", "Deadlocks", "Memory Mgmt"] },
          { title: "Web Technology - I", units: ["HTML & CSS", "JavaScript Basics", "XML", "Web Services"] },
          { title: "Core Java", units: ["Java Intro", "OOPs in Java", "Exception Handling", "Multithreading"] }
      ],
      "4": [
          { title: "Software Engineering", units: ["SDLC Models", "Software Testing", "Project Mgmt", "Software Quality"] },
          { title: "Computer Networks", units: ["OSI Model", "TCP/IP Protocol", "IP Addressing", "Network Security"] },
          { title: "Python Programming", units: ["Python Intro", "Data Types", "Functions & Modules", "File Handling"] },
          { title: "Web Technology - II", units: ["PHP Basics", "Sessions & Cookies", "MySQL Connectivity", "AJAX"] }
      ],
      "5": [
          { title: "Android Development", units: ["Android Studio", "Activities & Intents", "UI Design", "SQLite Database"] },
          { title: "Artificial Intelligence", units: ["AI Basics", "Search Algorithms", "Knowledge Rep.", "Expert Systems"] },
          { title: "Computer Graphics", units: ["Graphics Primitives", "2D Transformation", "3D Concepts", "Animation"] },
          { title: "Information System", units: ["MIS Concepts", "DSS", "ERP Systems", "Knowledge Mgmt"] }
      ],
      "6": [
          { title: "Information Security", units: ["Cyber Security", "Cryptography", "Network Security", "Cyber Laws"] },
          { title: "Cloud Computing", units: ["Cloud Models", "Virtualization", "AWS Services", "Cloud Security"] },
          { title: "Professional Ethics", units: ["Ethics in IT", "Intellectual Property", "Privacy", "Social Impact"] },
          { title: "Major Project", units: ["Project Synopsis", "Requirement Gathering", "Development", "Final Viva"] }
      ]
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      
      // 1. Backend se semesters list fetch karein
      const semRes = await axios.get('http://localhost:8081/api/semesters');
      
      // 2. Current semester ki MongoDB ID dhundein
      const currentSem = semRes.data.find((s, index) => (index + 1).toString() === id || s._id === id);
      
      let combinedData = [...(allSemestersData[id] || [])];

      if (currentSem) {
          // 3. API se naye subjects fetch karein
          const res = await axios.get(`http://localhost:8081/api/subjects/semester/${currentSem._id}`);
          
          if (res.data && res.data.length > 0) {
              const apiSubjects = res.data.map(sub => ({
                  title: sub.name,
                  units: sub.units || ["Unit 1", "Unit 2", "Unit 3", "Unit 4"], // Default units agar backend mein na ho
                  code: sub.code
              }));
              
              // 4. PURANA DATA + NAYA DATA MERGE (Purana pehle dikhega)
              combinedData = [...combinedData, ...apiSubjects];
          }
      }
      setSubjects(combinedData);

    } catch (error) {
      console.error("API Error, only showing Manual Data:", error);
      setSubjects(allSemestersData[id] || []);
    } finally {
      setLoading(false);
    }
  };

  fetchSubjects();
  
  const semNames = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];
  setSemesterName(semNames[id - 1] || `${id}th`);
}, [id]);

  const filteredList = subjects.filter((sub) => 
    sub.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{color:'white', textAlign:'center', marginTop:'100px'}}>Loading...</div>;

  return (
    <div className="semester-page">
      <button className="btn-back-nav" onClick={() => navigate(-1)} style={{position: 'absolute', top: '20px', left: '20px', padding: '10px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '5px'}}>
         <FaArrowLeft /> Back
      </button>

      <div className="semester-header">
        <div className="header-content">
          <h1 className="semester-title">{semesterName} Semester</h1>
          
          
       
        </div>
      </div>

      <div className="semester-content">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px'}}>
            <div>
                <span className="sub-heading-red">Notes</span>
                <h2 className="main-heading-white">{semesterName} Semester</h2>
            </div>

            <div className="search-container" style={{position: 'relative'}}>
                <FaSearch style={{position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'gray'}}/>
                <input 
                    type="text" 
                    placeholder="Search Subject..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{padding: '12px 15px 12px 40px', borderRadius: '25px', border: 'none', outline: 'none', width: '250px', background: '#1e1e1e', color: 'white'}}
                />
            </div>
        </div>

        {filteredList.length === 0 ? (
           <h3 style={{color: 'gray', marginTop: '20px'}}>No subjects found matching "{searchTerm}".</h3>
        ) : (
            <div className="subjects-grid">
            {filteredList.map((sub, index) => (
                <div key={index} className="subject-card">
                <div className="card-icon">{getIcon(sub.title)}</div>
                
                <h3 style={{ marginBottom: '10px' }}>{sub.title}</h3>

                {/* --- ACTION BUTTONS CONTAINER (NEW) --- */}
                <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px', flexWrap: 'wrap'}}>
                    
                    {/* 1. View Button */}
                    <button 
                        onClick={() => navigate(`/chapter/${sub.title}?mode=syllabus`)}
                        style={{
                            background: 'transparent',
                            border: '1px solid #FF5733',
                            color: '#FF5733',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <FaFilePdf /> View
                    </button>

                    {/* 2. NEW DOWNLOAD BUTTON (ON CARD) --- */}
                    <button 
                        onClick={() => handleDownloadSubject(sub.title)}
                        style={{
                            background: '#FF5733',
                            border: 'none',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <FaDownload /> Download
                    </button>
                    {/* ------------------------------------- */}

                </div>
                
                {/* Units List */}
                <div className="units-container">
                    {sub.units && sub.units.map((unitName, i) => (
                    <button 
                        key={i} 
                        className="btn-unit"
                        onClick={() => navigate(`/chapter/${unitName}`)}
                    >
                        {unitName}
                    </button>
                    ))}
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Semester;