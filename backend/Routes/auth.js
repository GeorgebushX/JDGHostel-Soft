import express from 'express';
import { login, verify } from '../Controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', authMiddleware, verify);  // <-- Change POST to GET

export default router;
