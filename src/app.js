import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

// user routes
import userRouter from "./routes/user.route.js";
app.use("/api/v1/users", userRouter);

// note routes
import noteRouter from "./routes/note.route.js";
app.use("/api/v1/notes", noteRouter);

export { app };
