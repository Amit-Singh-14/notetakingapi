import { ApiError, ApiResponse } from "../utils/apiUtil.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if ([title, content].some((field) => field?.trim() == "")) {
    throw new ApiError(400, "Title and content requried");
  }

  const user = req.user;

  const note = await Note.create({
    title,
    content,
    owner: req.user?._id,
  });

  if (!note) {
    throw new ApiError(500, "Something went wrong while creating new note");
  }

  user.notes.push(note._id);
  await user.save({ validateBeforeSave: false });

  return res.status(201).json(new ApiResponse(201, note, "new note created"));
});

const getNotes = asyncHandler(async (req, res) => {
  const noteId = req.params.noteid;
  //   console.log(req.params);
  if (noteId) {
    const note = await Note.findById(noteId);
    if (!note) {
      throw new ApiError(404, "Invalid noteId");
    }

    if (note.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(405, "unauthorized access to notes");
    }

    return res.status(200).json(new ApiResponse(200, note, "note Successfully retrived"));
  }
  const userWithNotes = await User.findById(req.user._id)
    .populate("notes")
    .select("-password -accessToken -owner");

  const notes = userWithNotes.notes;
  return res.status(200).json(new ApiResponse(200, notes, "all notes"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const noteid = req.params.noteid;

  if (!noteid) {
    throw new ApiError(404, "noteid required for deletion.");
  }

  const user = await User.findById(req.user._id);
  const noteIndex = user.notes.findIndex((note) => note._id.toString() === noteid);

  if (noteIndex === -1) {
    throw new ApiError(404, "Unauthorized access: Note not found in user's notes");
  }

  user.notes.splice(noteIndex, 1);
  await user.save({ validateBeforeSave: false });
  const deletedNote = await Note.findByIdAndDelete(noteid);

  if (!deletedNote) {
    throw new ApiError(404, "Note not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "note deleted"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const noteid = req.params.noteid;

  const updateField = {};
  if (title) updateField.title = title;
  if (content) updateField.content = content;

  const isNotePresent = req.user.notes.some((note) => note?.toString() === noteid);
  console.log(isNotePresent, noteid);
  if (!isNotePresent) {
    throw new ApiError(404, "Unauthorized access: Note not found in user's notes");
  }

  const updatedNote = await Note.findByIdAndUpdate(
    noteid,
    {
      $set: updateField,
    },
    { new: true }
  );

  if (!updatedNote) {
    throw new ApiError(404, "failed to update the Note");
  }

  return res.status(200).json(new ApiResponse(200, updatedNote, "note successfully updated"));
});

export { createNote, getNotes, deleteNote, updateNote };
