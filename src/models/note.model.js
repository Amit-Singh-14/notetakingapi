import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [4, "title length too short."],
    },
    content: {
      type: String,
      required: true,
      minlength: [10, "content length too short."],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
