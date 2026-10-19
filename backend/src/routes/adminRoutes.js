import express from 'express';
import { getAdminInsights } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/insights', getAdminInsights);

export default router;
