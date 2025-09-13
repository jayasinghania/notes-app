import express from 'express';
const router = express.Router();
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createNote).get(protect, getNotes);
router
  .route('/:id')
  .get(protect, getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

export default router;