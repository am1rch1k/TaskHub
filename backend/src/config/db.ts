import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI: string = process.env.MONGO_URI ?? "";

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

export async function connectDB(): Promise<void> {
  // 0 - disconnected, 1 - connected, 2 - connecting, 3 - disconnecting
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
}
