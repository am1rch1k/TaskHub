import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";

dotenv.config();

const app = express();

// CORS: разрешаем фронт на 5173 порту
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
  })
);

// умеем принимать JSON
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

// тестовый роут
app.get("/api/ping", (_req, res) => {
  res.json({ message: "pong from backend" });
});

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Backend server started on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
