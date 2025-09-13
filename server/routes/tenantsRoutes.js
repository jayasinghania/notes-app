import express from 'express';
const router = express.Router();
import { upgradeTenant } from '../controllers/tenantsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/:slug/upgrade').post(protect, admin, upgradeTenant);

export default router;