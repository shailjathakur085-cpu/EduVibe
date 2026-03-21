import express from 'express';
import { createProgram, getProgramsByLang,getProgramById ,deleteProgram, updateProgram} from '../controllers/programController.js';

const router = express.Router();

// Route: POST http://localhost:8081/api/programs/add
router.post('/add', createProgram);

// Route: GET http://localhost:8081/api/programs/c (Example)
router.get('/:lang', getProgramsByLang);
router.get('/view/:id', getProgramById);

router.delete('/delete/:id', deleteProgram);
router.put('/update/:id', updateProgram);

export default router;