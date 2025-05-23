import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { getAllUsers, getAllTasks, getUserTasks } from '../controllers/admin.controller.js';

const router = express.Router();
router.use(adminAuth);

router.get('/users', getAllUsers);

router.get('/tasks', getAllTasks);

router.get('/tasks/:userId', getUserTasks);

export default router; 