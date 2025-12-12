import express from "express";
import type { Request, Response } from "express";
import { Task, type ITask, type TaskPriority } from "../models/Task";

const router = express.Router();

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

    const normalized = tasks.map((t: any) => ({
      id: t._id.toString(),
      userId: t.userId,
      title: t.title,
      description: t.description ?? "",
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      priority: t.priority,
      color: t.color,
      isDone: t.isDone,
      remindAt: t.remindAt ? t.remindAt.toISOString() : null,
    }));

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
      task: {
        id: saved.id,
        userId: saved.userId,
        title: saved.title,
        description: saved.description ?? "",
        dueDate: saved.dueDate ? saved.dueDate.toISOString() : null,
        priority: saved.priority,
        color: saved.color,
        isDone: saved.isDone,
        remindAt: saved.remindAt ? saved.remindAt.toISOString() : null,
      },
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

    const update: Partial<ITask> = {};

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
      task: {
        id: updated.id,
        userId: updated.userId,
        title: updated.title,
        description: updated.description ?? "",
        dueDate: updated.dueDate ? updated.dueDate.toISOString() : null,
        priority: updated.priority,
        color: updated.color,
        isDone: updated.isDone,
        remindAt: updated.remindAt ? updated.remindAt.toISOString() : null,
      },
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

    const task = await Task.findById(id).exec();

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Задача не найдена",
      });
    }

    task.isDone = !task.isDone;
    await task.save();

    return res.json({
      success: true,
      task: {
        id: task.id,
        userId: task.userId,
        title: task.title,
        description: task.description ?? "",
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        priority: task.priority,
        color: task.color,
        isDone: task.isDone,
        remindAt: task.remindAt ? task.remindAt.toISOString() : null,
      },
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
