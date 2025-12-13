import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import { Task, type TaskPriority } from "../models/Task";

const router = express.Router();

// --------- ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ----------

interface CreateTaskBody {
  userId?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  color?: string;
  remindAt?: string;
}

interface UpdateTaskBody {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  color?: string;
  isDone?: boolean;
  remindAt?: string;
}

// То, что мы реально возвращаем на фронт
type TaskResponse = {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  color?: string;
  isDone: boolean;
  remindAt: string | null;
};

// Безопасное преобразование к ISO-строке
function toIsoOrNull(value: unknown): string | null {
  if (!value) return null;

  const date =
    value instanceof Date ? value : new Date(value as string | number);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

// Маппинг mongoose-документа в TaskResponse
function mapTask(doc: any): TaskResponse {
  return {
    id: doc._id.toString(),
    userId: doc.userId?.toString?.() ?? doc.userId,
    title: doc.title,
    description: doc.description ?? "",
    dueDate: toIsoOrNull(doc.dueDate),
    priority: doc.priority,
    color: doc.color,
    isDone: !!doc.isDone,
    remindAt: toIsoOrNull(doc.remindAt),
  };
}

// --------- МАРШРУТЫ ----------

// GET /api/tasks?userId=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId обязателен",
      });
    }

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 }).exec();

    const normalized: TaskResponse[] = tasks.map((t: any) => mapTask(t));

    return res.json({
      success: true,
      tasks: normalized,
    });
  } catch (err) {
    console.error("Ошибка при получении задач:", err);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при получении задач",
    });
  }
});

// POST /api/tasks
router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateTaskBody;
    const { userId, title, description, dueDate, priority, color, remindAt } =
      body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId обязателен",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Название задачи обязательно",
      });
    }

    const task = new Task({
      userId,
      title: title.trim(),
      description: description?.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || "medium",
      color,
      remindAt: remindAt ? new Date(remindAt) : undefined,
      isDone: false,
    });

    const saved = await task.save();

    return res.status(201).json({
      success: true,
      task: mapTask(saved),
    });
  } catch (err) {
    console.error("Ошибка при создании задачи:", err);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при создании задачи",
    });
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body as UpdateTaskBody;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Некорректный идентификатор задачи",
      });
    }

    const update: any = {};

    if (body.title !== undefined) {
      update.title = body.title.trim();
    }
    if (body.description !== undefined) {
      update.description = body.description.trim();
    }
    if (body.dueDate !== undefined) {
      update.dueDate = body.dueDate ? new Date(body.dueDate) : undefined;
    }
    if (body.priority !== undefined) {
      update.priority = body.priority;
    }
    if (body.color !== undefined) {
      update.color = body.color;
    }
    if (body.isDone !== undefined) {
      update.isDone = body.isDone;
    }
    if (body.remindAt !== undefined) {
      update.remindAt = body.remindAt ? new Date(body.remindAt) : undefined;
    }

    const updated = await Task.findByIdAndUpdate(id, update, {
      new: true,
    }).exec();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Задача не найдена",
      });
    }

    return res.json({
      success: true,
      task: mapTask(updated),
    });
  } catch (err) {
    console.error("Ошибка при обновлении задачи:", err);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при обновлении задачи",
    });
  }
});

// PATCH /api/tasks/:id/toggle
router.patch("/:id/toggle", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("PATCH /api/tasks/:id/toggle", id);

    if (!mongoose.isValidObjectId(id)) {
      console.warn("Некорректный ObjectId при toggle:", id);
      return res.status(400).json({
        success: false,
        message: "Некорректный идентификатор задачи",
      });
    }

    const task: any = await Task.findById(id).exec();

    if (!task) {
      console.warn("Задача не найдена при toggle:", id);
      return res.status(404).json({
        success: false,
        message: "Задача не найдена",
      });
    }

    task.isDone = !task.isDone;
    await task.save();

    const responseTask = mapTask(task);

    console.log("Успешный toggle задачи:", id, "isDone:", task.isDone);

    return res.json({
      success: true,
      task: responseTask,
    });
  } catch (err) {
    console.error("Ошибка при переключении статуса задачи:", err);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при изменении статуса задачи",
    });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      console.warn("Некорректный ObjectId при удалении:", id);
      return res.status(400).json({
        success: false,
        message: "Некорректный идентификатор задачи",
      });
    }

    const deleted = await Task.findByIdAndDelete(id).exec();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Задача не найдена",
      });
    }

    return res.json({
      success: true,
      message: "Задача удалена",
    });
  } catch (err) {
    console.error("Ошибка при удалении задачи:", err);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при удалении задачи",
    });
  }
});

export default router;
