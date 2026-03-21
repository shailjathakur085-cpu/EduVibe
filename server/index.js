import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';
import fs from 'fs';

// Routes Imports
import streamRoutes from './routes/streamRoute.js';
import semesterRoutes from './routes/semesterRoute.js';
import subjectRoutes from './routes/subjectRoute.js';
import userRoutes from './routes/userRoute.js';
import programRoutes from './routes/programRoutes.js';
import syllabusRoutes from './routes/syllabusRoute.js';
import noteRoutes from './routes/noteRoute.js';

dotenv.config();

const app = express(); // Pehle app banega

// --- STEP 1: MIDDLEWARES (Sabse upar) ---
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json()); 

// Static files setup
app.use('/uploads', express.static('uploads')); 

// --- STEP 2: ROUTES ---
app.use('/api/streams', streamRoutes);
app.use('/api/semesters', semesterRoutes); 
app.use('/api/subjects', subjectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/syllabi', syllabusRoutes);
app.use('/api/notes', noteRoutes);

// --- STEP 3: DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URl || 'mongodb://localhost:27017/bcaproject';
    const conn = await mongoose.connect(dbUrl);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`❌ DB Error: ${error.message}`);
    process.exit(1); 
  }
};
connectDB();

// --- STEP 4: MULTER SETUP (For PDF Uploads) ---
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
  }
});

// Upload API
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(200).json({
    message: 'File uploaded successfully!',
    filePath: `/uploads/${req.file.filename}`
  });
});
// --- STEP 5: SECURE DOWNLOAD ROUTE ---

// Yeh ek middleware hai jo check karega ki request mein token hai ya nahi
const verifyUser = (req, res, next) => {
  // Frontend se token headers mein aayega (e.g., Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    // Agar token hai, toh agle step (next) par jao
    // Note: Agar aap JWT use kar rahe hain toh yahan jwt.verify() lagana hoga
    next();
  } else {
    // Agar token nahi hai, toh error bhej do
    res.status(401).json({ error: "Unauthorized: Please login to download" });
  }
};

// Yeh route download ke liye hai (Authenticated)
app.get('/api/secure-download/:filename', verifyUser, (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', fileName);

  if (fs.existsSync(filePath)) {
    // res.download() browser ko batata hai ki file "Save" karni hai, "Open" nahi
    res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(500).send({ message: "Could not download the file. " + err });
      }
    });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});
// PDF Viewer API
app.get('/api/pdf/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Main Route
app.get('/', (req, res) => {
  res.send('EduVibe Backend is Running!');
});
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});