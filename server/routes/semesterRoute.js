import express from 'express';
import { createSemester, getAllSemesters, deleteSemester, updateSemester } from '../controllers/semesterController.js';

const router = express.Router();

// 1. Get All (Frontend calls: /api/semesters)
router.get('/', getAllSemesters);

// 2. Create (Frontend calls: /api/semesters/create)
router.post('/create', createSemester);

// 3. Delete (Frontend calls: /api/semesters/delete/:id)
router.delete('/delete/:id', deleteSemester);

// 4. Update (Frontend calls: /api/semesters/update/:id)
router.put('/update/:id', updateSemester);

export default router;