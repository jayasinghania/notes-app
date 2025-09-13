import asyncHandler from 'express-async-handler';
import Note from '../models/Note.js';
import Tenant from '../models/Tenant.js';
import User from '../models/User.js';

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const user = await User.findById(req.user._id).populate('tenant');
  const tenant = user.tenant;

  if (tenant.plan === 'free') {
    const count = await Note.countDocuments({ tenant: tenant._id });
    if (count >= 3) {
      res.status(403);
      throw new Error('Free plan limit of 3 notes reached');
    }
  }

  const note = new Note({
    title,
    content,
    user: req.user._id,
    tenant: tenant._id,
  });

  const createdNote = await note.save();
  res.status(201).json(createdNote);
});

// @desc    Get all notes for a tenant
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ tenant: req.user.tenant });
  res.json(notes);
});

// @desc    Get a single note
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.tenant.toString() === req.user.tenant.toString()) {
    res.json(note);
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const note = await Note.findById(req.params.id);

  if (note.tenant.toString() !== req.user.tenant.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  if (note) {
    note.title = title;
    note.content = content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note.tenant.toString() !== req.user.tenant.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  if (note) {
    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

export { createNote, getNotes, getNoteById, updateNote, deleteNote };