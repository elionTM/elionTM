import express from 'express';
import { getServices, createProject, getProjects, createService, updateService, deleteService, updateProjectStatus } from '../controllers/serviceController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/services', getServices);

// Publicly accessible project creation (e.g. for potential clients)
// But we might want to protect it depending on the flow.
// For now, let's keep it protected as per previous turn.
router.use(protect);

router.post('/projects', createProject);
router.get('/projects', getProjects);
router.patch('/projects/:id/status', restrictTo('admin'), updateProjectStatus);

// Admin only service management
router.post('/services', restrictTo('admin'), createService);
router.patch('/services/:id', restrictTo('admin'), updateService);
router.delete('/services/:id', restrictTo('admin'), deleteService);

export default router;
