import { config } from "dotenv";
config({
  path: "./.env",
});

import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, (req, res) => {
      console.log(`server listening on PORT :`, PORT);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed ||| ", err);
  });
