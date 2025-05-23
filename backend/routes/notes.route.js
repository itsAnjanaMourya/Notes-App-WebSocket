import express from 'express'
import { addNote, getNotes, updateNote, deleteNote } from '../controllers/note.controller.js';
import protect from '../middleware/authMiddleware.js';
const notesRouter = express.Router()

notesRouter.post("/addNote", protect, addNote)

notesRouter.get("/getNotes", protect, getNotes)

notesRouter.put("/updateNote/:id", protect, updateNote)


notesRouter.delete("/deleteNote/:id", protect, deleteNote)

export default notesRouter;