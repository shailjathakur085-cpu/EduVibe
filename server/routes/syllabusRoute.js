import express from 'express';
import { 
  createSyllabus, 
  getAllSyllabi, 
  getSyllabiBySemester, 
  updateSyllabus, 
  deleteSyllabus 
} from '../controllers/syllabusController.js';

const router = express.Router();

// Create Syllabus
router.post('/create', createSyllabus);

// Get All Syllabi
router.get('/', getAllSyllabi);

// Get Syllabi by Semester
router.get('/semester/:semesterId', getSyllabiBySemester);

// Update Syllabus
router.put('/update/:id', updateSyllabus);

// Delete Syllabus
router.delete('/delete/:id', deleteSyllabus);

export default router;
