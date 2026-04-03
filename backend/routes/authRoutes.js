import express from 'express';
import { signup, login, getMe, logout, updateProfile, protect, getAllUsers, adminCreateUser } from '../controllers/authController.js';
import { restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', getMe);
router.patch('/updateProfile', protect, updateProfile);

// Admin only user management
router.get('/users', protect, restrictTo('admin'), getAllUsers);
router.post('/users', protect, restrictTo('admin'), adminCreateUser);

export default router;
