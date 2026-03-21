import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaDownload, FaBook } from 'react-icons/fa';
import './SectionPage.css';

// Aap yahan se bhi tags: [...] wali lines delete kar sakte hain 
// taaki data object clean ho jaye.
const sectionData = {
  "section-1": [
    { id: 1, name: "C Programming", pdf: "C PROG..pdf" },
    { id: 2, name: "Digital Electronics", pdf: "digital.pdf" },
    { id: 3, name: "Computer Organization", pdf: "CO.pdf" },
    { id: 4, name: "Mathematics - I", pdf: "Mathematics.pdf" },
    { id: 5, name: " Multimedia", pdf: "Multimedia.pdf" },
  ],
  "section-2": [
    { id: 6, name: "Data Structures", pdf: "DATA STRUUCTURE.pdf" },
    { id: 7, name: "Object Oriented C++", pdf: "OOPS.pdf" },
    { id: 8, name: "Operating System", pdf: "OS.pdf" },
    { id: 9, name: "Software Engineering", pdf: "SE.pdf" },
    { id: 10, name: "Database Management", pdf: "DBMS.pdf" },
  ],
  "section-3": [
    { id: 11, name: "Java Programming", pdf: "JAVA NOTES.pdf" },
    { id: 12, name: "Computer Networks", pdf: "CN.pdf" },
    { id: 13, name: "Web Technology", pdf: "Web T.pdf" },
    { id: 14, name: "Python", pdf: "PY.pdf" },
    { id: 15, name: "Cloud Computing", pdf: "CC.pdf" },
  ]
};

const Section = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const subjects = sectionData[sectionId] || [];
  const user = JSON.parse(localStorage.getItem("user"));

  const handleAction = (type, pdfName) => {
    const fileUrl = `http://localhost:8081/api/pdf/${pdfName}`;

    if (type === 'view') {
      window.open(fileUrl, '_blank');
    } 
    else if (type === 'download') {
      if (!user) {
        Swal.fire({
          title: 'Login Required',
          text: 'Please login to download the notes!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#FF5733',
          background: '#1a1a1a', 
          color: '#fff'
        }).then((res) => { 
          if (res.isConfirmed) navigate('/login'); 
        });
      } else {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', pdfName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Downloading started...',
          showConfirmButton: false,
          timer: 2000,
          background: '#1a1a1a',
          color: '#fff'
        });
      }
    }
  };

  return (
    <div className="section-container">
      <h2 className="section-title">
        Computer Science - {sectionId?.replace('-', ' ').toUpperCase()}
      </h2>
      <div className="subject-grid">
        {subjects.map((sub) => (
          <div key={sub.id} className="subject-card">
            <div className="sub-icon"><FaBook /></div>
            <h3>{sub.name}</h3>
            <div className="btn-group">
              <button onClick={() => handleAction('view', sub.pdf)} className="btn-view">
                <FaEye /> View
              </button>
              <button onClick={() => handleAction('download', sub.pdf)} className="btn-download">
                <FaDownload /> Download
              </button>
            </div>
            {/* Tags section yahan se remove kar diya gaya hai */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;