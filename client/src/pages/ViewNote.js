import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf, FaCalendar, FaUser, FaTag } from 'react-icons/fa';
import PDFViewer from '../components/PDFViewer';
import './ViewNote.css';

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingPdf, setViewingPdf] = useState(null);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      console.log('Fetching note with ID:', id);
      const response = await fetch(`http://localhost:8081/api/notes/${id}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Note data received:', data);
        console.log('PDF URL:', data.pdfUrl);
        console.log('Semester data:', data.semester);
        setNote(data);
      } else {
        console.error('Failed to fetch note:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdf = () => {
    console.log('View PDF clicked');
    console.log('Note PDF URL:', note.pdfUrl);
    console.log('Note object:', note);
    
    if (note.pdfUrl) {
      console.log('Opening PDF viewer with URL:', note.pdfUrl);
      setViewingPdf({ url: note.pdfUrl, title: note.title });
    } else {
      console.log('No PDF URL available');
      alert('No PDF available for this note');
    }
  };

  if (loading) {
    return (
      <div className="view-note-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="view-note-container">
        <div className="note-not-found">
          <h2>Note Not Found</h2>
          <p>The note you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/notes')} className="back-btn">
            <FaArrowLeft /> Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-note-container">
      {/* Header */}
      <div className="view-note-header">
        <button onClick={() => navigate('/notes')} className="back-btn">
          <FaArrowLeft /> Back to Notes
        </button>
        <h1>{note.title}</h1>
      </div>

      {/* Note Content */}
      <div className="view-note-content">
        <div className="note-meta">
          <div className="meta-item">
            <FaUser className="meta-icon" />
            <span>Uploaded by: {note.uploadedBy?.name || 'Admin'}</span>
          </div>
          <div className="meta-item">
            <FaCalendar className="meta-icon" />
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="meta-item">
            <FaTag className="meta-icon" />
            <span>{note.subject}</span>
          </div>
          {note.semester && (
            <div className="meta-item">
              <span className="semester-badge">{note.semester.name || note.semester}</span>
            </div>
          )}
        </div>

        {note.description && (
          <div className="note-description">
            <h3>Description</h3>
            <p>{note.description}</p>
          </div>
        )}

        {note.content && (
          <div className="note-content-text">
            <h3>Content</h3>
            <div dangerouslySetInnerHTML={{ __html: note.content.replace(/\n/g, '<br>') }} />
          </div>
        )}

        {note.tags && note.tags.length > 0 && (
          <div className="note-tags-section">
            <h3>Tags</h3>
            <div className="tags-container">
              {note.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="note-actions">
          {note.pdfUrl && (
            <button onClick={handleViewPdf} className="pdf-btn">
              <FaFilePdf /> View PDF
            </button>
          )}
        </div>
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

export default ViewNote;
