import { Router } from "express";
import { createNote, getNotes, deleteNote, updateNote } from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ristricted routes
router.route("/createnote").post(verifyJWT, createNote);
router.route("/getnotes/:noteid?").get(verifyJWT, getNotes);
router.route("/deletenote/:noteid").delete(verifyJWT, deleteNote);
router.route("/updatenote/:noteid").patch(verifyJWT, updateNote);

export default router;
