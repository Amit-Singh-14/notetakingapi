import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    console.log(`MongoDB connected || DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGOB connection error", error);
    process.emit(1);
  }
};

export default connectDB;
