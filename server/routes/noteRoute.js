import express from 'express';
import { Note } from '../models/Note.js';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Semester from '../models/Semester.js';

const router = express.Router();

// Multer setup for note PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'note_' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// GET single note by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('=== Fetching Single Note ===');
    console.log('Note ID:', req.params.id);
    
    const note = await Note.findById(req.params.id)
      .populate('semester', 'name')
      .populate('uploadedBy', 'name');
    
    console.log('Found note:', note);
    console.log('PDF URL:', note?.pdfUrl);
    console.log('Semester data:', note?.semester);
    
    if (!note) {
      console.log('Note not found');
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ isActive: true })
      .populate('semester', 'name')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET notes by subject
router.get('/subject/:subjectName', async (req, res) => {
  try {
    const { subjectName } = req.params;
    const notes = await Note.find({ 
      subject: { $regex: subjectName, $options: 'i' },
      isActive: true 
    })
      .populate('semester', 'name')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET notes by semester
router.get('/semester/:semesterId', async (req, res) => {
  try {
    const { semesterId } = req.params;
    const notes = await Note.find({ 
      semester: semesterId,
      isActive: true 
    })
      .populate('semester', 'name')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('semester', 'name')
      .populate('uploadedBy', 'name');
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new note (with PDF upload)
router.post('/', upload.single('pdfFile'), async (req, res) => {
  try {
    console.log('Creating note with data:', req.body);
    console.log('File uploaded:', req.file);
    
    const { title, subject, semester, description, content, tags } = req.body;
    
    // Get admin user (you might want to get this from JWT token)
    const UserModel = mongoose.model('User');
    const adminUser = await UserModel.findOne({ role: 'admin' });
    
    if (!adminUser) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    const noteData = {
      title,
      subject,
      description,
      content,
      uploadedBy: adminUser._id,
      isActive: true
    };

    // Set default semester (you can change this to whatever you want)
    // Get first semester as default
    const defaultSemester = await Semester.findOne();
    if (defaultSemester) {
      noteData.semester = defaultSemester._id;
      console.log('Default semester assigned:', defaultSemester._id);
    } else {
      console.log('No semester found in database');
      // Create a default semester if none exists
      const newSemester = new Semester({
        name: 'Default Semester'
      });
      await newSemester.save();
      noteData.semester = newSemester._id;
      console.log('Created new default semester:', newSemester._id);
    }

    // Handle PDF upload
    if (req.file) {
      noteData.pdfUrl = `http://localhost:8081/api/pdf/${req.file.filename}`;
      noteData.pdfFilename = req.file.filename;
    }

    // Handle tags
    if (tags) {
      noteData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }

    const note = new Note(noteData);
    console.log('Note data before save:', noteData);
    await note.save();
    console.log('Note saved successfully:', note._id);
    
    const populatedNote = await Note.findById(note._id)
      .populate('semester', 'name')
      .populate('uploadedBy', 'name');
    
    res.status(201).json(populatedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update note
router.put('/:id', upload.single('pdfFile'), async (req, res) => {
  try {
    const { title, subject, description, content, tags, isActive } = req.body;
    
    const noteData = {};
    
    if (title !== undefined) noteData.title = title;
    if (subject !== undefined) noteData.subject = subject;
    if (description !== undefined) noteData.description = description;
    if (content !== undefined) noteData.content = content;
    // Handle PDF upload
    if (req.file) {
      // Delete old PDF if exists
      const oldNote = await Note.findById(req.params.id);
      if (oldNote && oldNote.pdfFilename) {
        const oldFilePath = path.join(process.cwd(), 'uploads', oldNote.pdfFilename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      noteData.pdfUrl = `http://localhost:8081/api/pdf/${req.file.filename}`;
      noteData.pdfFilename = req.file.filename;
    }
    
    // Handle tags
    if (tags) {
      noteData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }
    
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      noteData,
      { new: true, runValidators: true }
    )
      .populate('semester', 'name')
      .populate('uploadedBy', 'name');
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    // Delete PDF file if exists
    if (note.pdfFilename) {
      const filePath = path.join(process.cwd(), 'uploads', note.pdfFilename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Note.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST like a note
router.post('/:id/like', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // For now, we'll use a simple approach - just increment like count
    // In a real app, you'd get user ID from JWT token and check if already liked
    note.likeCount += 1;
    await note.save();
    
    res.json({ 
      message: 'Note liked successfully',
      likeCount: note.likeCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST unlike a note
router.post('/:id/unlike', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Prevent negative likes
    if (note.likeCount > 0) {
      note.likeCount -= 1;
      await note.save();
    }
    
    res.json({ 
      message: 'Note unliked successfully',
      likeCount: note.likeCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET like count for a note
router.get('/:id/likes', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).select('likeCount');
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ likeCount: note.likeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
