import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCode, FaDatabase, FaHtml5, FaCss3Alt, FaJs, FaReact, FaJava, FaFilePdf, FaSearch, FaFilter, FaBook, FaHeart, FaRegHeart } from 'react-icons/fa';
import { SiMysql } from 'react-icons/si';
import PDFViewer from '../components/PDFViewer';
import './Notes.css';

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [viewingPdf, setViewingPdf] = useState(null);

  // Fetch notes from database
  const fetchNotes = async () => {
    try {
      console.log('Fetching notes from server...');
      const response = await fetch('http://localhost:8081/api/notes');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched notes:', data);
      console.log('Number of notes:', data.length);
      
      setNotes(data);
      setFilteredNotes(data);
      
      // Extract unique subjects and semesters
      const uniqueSubjects = [...new Set(data.map(note => note.subject))];
      const uniqueSemesters = [...new Set(data.map(note => note.semester?.name).filter(Boolean))];
      
      console.log('Unique subjects:', uniqueSubjects);
      console.log('Unique semesters:', uniqueSemesters);
      
      setSubjects(uniqueSubjects);
      setSemesters(uniqueSemesters);
    } catch (error) {
      console.error('Error fetching notes:', error);
      alert('Failed to fetch notes. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter notes based on search and filters
  useEffect(() => {
    let filtered = notes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Semester filter
    if (selectedSemester) {
      filtered = filtered.filter(note => note.semester?.name === selectedSemester);
    }

    // Subject filter
    if (selectedSubject) {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }

    setFilteredNotes(filtered);
  }, [notes, searchTerm, selectedSemester, selectedSubject]);

  // Get icon for subject
  const getSubjectIcon = (subjectName) => {
    const name = subjectName ? subjectName.toLowerCase() : '';
    if (name.includes('c++') || name.includes('java') || name.includes('python') || name.includes('programming')) return <FaCode />;
    if (name.includes('html') || name.includes('css') || name.includes('javascript') || name.includes('react')) return <FaHtml5 />;
    if (name.includes('database') || name.includes('sql') || name.includes('dbms')) return <SiMysql />;
    if (name.includes('web') || name.includes('internet')) return <FaReact />;
    return <FaBook />;
  };

  // Handle PDF view
  const handleViewPdf = (note) => {
    if (note.pdfUrl) {
      setViewingPdf({ url: note.pdfUrl, title: note.title });
    } else {
      alert('No PDF available for this note');
    }
  };

  // Handle note content view
  const handleViewContent = (note) => {
    // Navigate to a detailed view or show content in modal
    navigate(`/view-note/${note._id}`);
  };

  // Handle like note
  const handleLikeNote = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/notes/${noteId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update the note in the state
        setNotes(notes.map(note => 
          note._id === noteId 
            ? { ...note, likeCount: data.likeCount }
            : note
        ));
      }
    } catch (error) {
      console.error('Error liking note:', error);
    }
  };

  // Handle unlike note
  const handleUnlikeNote = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/notes/${noteId}/unlike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update the note in the state
        setNotes(notes.map(note => 
          note._id === noteId 
            ? { ...note, likeCount: data.likeCount }
            : note
        ));
      }
    } catch (error) {
      console.error('Error unliking note:', error);
    }
  };

  if (loading) {
    return (
      <div className="notes-page-dark">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-page-dark">
      <div className="notes-hero">
        <p className="nots-label">Study Notes</p>
        <h1>BCA Study Materials</h1>
        <p>Access comprehensive study notes uploaded by faculty</p>
      </div>

      {/* Search and Filter Section */}
      <div className="notes-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search notes by title, subject, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <FaFilter className="filter-icon" />
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="filter-select"
          >
            <option value="">All Semesters</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="filter-select"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="no-notes-found">
          <FaBook className="no-notes-icon" />
          <h3>No Notes Found</h3>
          <p>
            {searchTerm || selectedSemester || selectedSubject
              ? 'Try adjusting your filters or search terms'
              : 'No notes have been uploaded yet. Check back later!'}
          </p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div key={note._id} className="note-card">
              <div className="note-icon-orange">{getSubjectIcon(note.subject)}</div>
              
              <div className="note-content">
                <h3>{note.title}</h3>
                <p className="note-subject">{note.subject}</p>
                {note.semester && (
                  <span className="note-semester">{note.semester.name}</span>
                )}
                
                {note.description && (
                  <p className="note-description">
                    {note.description.length > 100 
                      ? note.description.substring(0, 100) + '...' 
                      : note.description}
                  </p>
                )}
                
                {note.tags && note.tags.length > 0 && (
                  <div className="note-tags">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="tag">+{note.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="note-actions">
                {/* Like Button */}
                {/* <button 
                  className="note-like-btn"
                  onClick={() => handleLikeNote(note._id)}
                  title="Like this note"
                >
                  <FaRegHeart /> {note.likeCount || 0}
                </button> */}
                
                {note.pdfUrl && (
                  <button 
                    className="note-pdf-btn"
                    onClick={() => handleViewPdf(note)}
                    title="View PDF"
                  >
                    <FaFilePdf /> PDF
                  </button>
                )}
                
                <button 
                  className="note-view-btn"
                  onClick={() => handleViewContent(note)}
                  title="View Details"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default Notes;