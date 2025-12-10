import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./src/config/db";
import authRoutes from "./src/routes/auth";
import taskRoutes from "./src/routes/tasks";

const app = express();

app.use(
  cors({
    origin: "*", // можно сузить до домена фронта
  })
);
app.use(express.json());

// маршруты
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/ping", (_req: Request, res: Response) => {
  res.json({ message: "pong from backend (Vercel)" });
});

let dbPromise: Promise<void> | null = null;

async function ensureDBConnected() {
  if (!dbPromise) {
    dbPromise = connectDB().catch((err) => {
      console.error("Mongo connection error:", err);
      dbPromise = null;
      throw err;
    });
  }
  await dbPromise;
}

// handler
export default async function handler(req: any, res: any) {
  try {
    await ensureDBConnected();
  } catch (err) {
    console.error("Failed to connect DB:", err);
    res
      .status(500)
      .json({ success: false, message: "Ошибка подключения к базе данных" });
    return;
  }

  // Express-приложение само является функцией (req, res)
  (app as any)(req, res);
}
