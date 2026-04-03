import express from 'express';
import { getPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '../controllers/portfolioController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPortfolio);

// Admin only routes
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createPortfolioItem);
router.patch('/:id', updatePortfolioItem);
router.delete('/:id', deletePortfolioItem);

export default router;
