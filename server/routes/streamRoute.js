import express from 'express';

import { createStream, getAllStreams } from '../controllers/streamController.js';

const router = express.Router();


router.post('/', createStream);
router.get('/', getAllStreams);

export default router;