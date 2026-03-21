import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUpload, FaTrash, FaEdit, FaFilePdf, FaPlus, FaSave } from 'react-icons/fa';
import PDFViewer from '../../components/PDFViewer';
import './AddNote.css';

const AddNote = () => {
  // --- States ---
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [notesList, setNotesList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [existingSubjects, setExistingSubjects] = useState([]);
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);

  // --- Fetch Data ---
  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/notes');
      setNotesList(res.data);
      
      // Extract unique subjects from existing notes
      const subjects = [...new Set(res.data.map(note => note.subject))];
      setExistingSubjects(subjects);
    } catch (error) {
      console.error('Error fetching notes:', error);
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
    fetchNotes();
    fetchSemesters();
  }, []);

  // --- Simple File Upload ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    // IMPORTANT: Use 'file' as field name to match server
    formData.append('file', file);

    console.log('FormData prepared:', formData);

    try {
      const res = await axios.post('http://localhost:8081/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000
      });
      
      console.log('Upload response:', res.data);
      setPdfUrl(`http://localhost:8081/api/pdf/${res.data.filename}`);
      alert('PDF uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error details:', error.response?.data);
      alert(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // --- Simple Form Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !subject.trim()) {
      alert('Please fill in title and subject');
      return;
    }

    try {
      const noteData = {
        title,
        subject,
        description,
        content,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        pdfUrl
      };

      if (editingId) {
        await axios.put(`http://localhost:8081/api/notes/${editingId}`, noteData);
        alert('Note updated successfully!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:8081/api/notes', noteData);
        alert('Note added successfully!');
      }

      // Reset form
      setTitle('');
      setSubject('');
      setDescription('');
      setContent('');
      setTags('');
      setPdfUrl('');
      setCustomSubject('');
      setShowCustomSubject(false);
      
      // Refresh notes list
      fetchNotes();

    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to save note: ${error.response?.data?.error || error.message}`);
    }
  };

  // --- Edit Note ---
  const handleEdit = (note) => {
    setTitle(note.title);
    setSubject(note.subject);
    setDescription(note.description || '');
    setContent(note.content || '');
    setTags(note.tags ? note.tags.join(', ') : '');
    setPdfUrl(note.pdfUrl || '');
    setEditingId(note._id);
  };

  // --- Delete Note ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`http://localhost:8081/api/notes/${id}`);
        alert('Note deleted successfully!');
        fetchNotes();
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete note. Please try again.');
      }
    }
  };

  // --- Cancel Edit ---
  const handleCancel = () => {
    setTitle('');
    setSubject('');
    setDescription('');
    setContent('');
    setTags('');
    setPdfUrl('');
    setCustomSubject('');
    setShowCustomSubject(false);
    setEditingId(null);
  };

  return (
    <div className="add-note-container">
      <div className="add-note-header">
        <h1>{editingId ? 'Edit Note' : 'Add New Note'}</h1>
        <p>Upload and manage study notes for students</p>
      </div>

      {/* Add/Edit Form */}
      <div className="add-note-form">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Note Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Chapter 1 - Introduction to C Programming"
                required
              />
            </div>

            <div className="form-group">
              <label>Subject Name *</label>
              <select
                value={showCustomSubject ? 'custom_new_subject' : subject}
                onChange={(e) => {
                  if (e.target.value === 'custom_new_subject') {
                    setShowCustomSubject(true);
                    setSubject('');
                  } else {
                    setSubject(e.target.value);
                    setShowCustomSubject(false);
                    setCustomSubject('');
                  }
                }}
                required
              >
                <option value="">Select Subject</option>
                {existingSubjects.map((subj, index) => (
                  <option key={index} value={subj}>
                    {subj}
                  </option>
                ))}
                <option value="custom_new_subject">+ Add New Subject</option>
              </select>
              {showCustomSubject && (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => {
                    setCustomSubject(e.target.value);
                    setSubject(e.target.value);
                  }}
                  placeholder="Enter new subject name"
                  required
                  style={{ marginTop: '10px' }}
                />
              )}
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., important, basics, tutorial (comma separated)"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the note content..."
              rows="3"
            />
          </div>

          <div className="form-group full-width">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed content or key points..."
              rows="5"
            />
          </div>

          {/* PDF Upload Section */}
          {/* <div className="form-group full-width">
            <label>Upload PDF (Optional)</label>
            <div className="file-upload-section">
              <input
                type="file"
                id="pdfFile"
                accept=".pdf"
                onChange={handleFileUpload}
                className="file-input"
              />
              <label htmlFor="pdfFile" className="file-upload-label">
                <FaUpload className="upload-icon" />
                <span>Choose PDF File</span>
              </label>
              {uploading && (
                <div className="upload-status uploading">
                  Uploading...
                </div>
              )}
              {pdfUrl && !uploading && (
                <div className="upload-status success">
                  ✅ PDF uploaded successfully!
                </div>
              )}
            </div>
          </div> */}

          {/* Form Buttons */}
          <div className="form-buttons">
            <button type="submit" className="btn-submit" disabled={uploading}>
              <FaSave /> {editingId ? 'Update Note' : 'Add Note'}
            </button>
            {editingId && (
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Notes List */}
      <div className="notes-list-section">
        <div className="notes-list-header">
          <h2>Manage Notes</h2>
          <span className="notes-count">{notesList.length} Notes</span>
        </div>

        {notesList.length === 0 ? (
          <div className="empty-state">
            <FaFilePdf className="empty-state-icon" />
            <h3>No Notes Added Yet</h3>
            <p>Start by adding your first study note using the form above.</p>
          </div>
        ) : (
          <div className="notes-table-container">
            <table className="notes-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Semester</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notesList.map((note) => (
                  <tr key={note._id}>
                    <td>
                      <div className="note-title">
                        {note.title}
                      </div>
                    </td>
                    <td>{note.subject}</td>
                    <td>
                      <span className="semester-badge">
                        {note.semester?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="note-description">
                      {note.description ? (note.description.length > 50 ? note.description.substring(0, 50) + '...' : note.description) : 'No description'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {/* View PDF Button */}
                        {note.pdfUrl && (
                          <button 
                            onClick={() => setViewingPdf({ url: note.pdfUrl, title: note.title })}
                            className="btn-view"
                            title="View PDF"
                          >
                            <FaFilePdf /> View
                          </button>
                        )}

                        {/* Edit Button */}
                        <button onClick={() => handleEdit(note)} className="btn-edit" title="Edit">
                          <FaEdit />
                        </button>

                        {/* Delete Button */}
                        <button onClick={() => handleDelete(note._id)} className="btn-delete" title="Delete">
                          <FaTrash />
                        </button>
                      </div>
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

export default AddNote;
