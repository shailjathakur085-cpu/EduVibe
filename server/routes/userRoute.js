import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Register: POST http://localhost:8081/api/users/register
router.post('/register', registerUser);

// Login: POST http://localhost:8081/api/users/login
router.post('/login', loginUser);

export default router;