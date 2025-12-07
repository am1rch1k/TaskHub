"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Task_1 = require("../models/Task");
const router = express_1.default.Router();
// GET /api/tasks?userId=...
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId обязателен",
            });
        }
        const tasks = await Task_1.Task.find({ userId }).sort({ createdAt: -1 }).exec();
        return res.json({
            success: true,
            tasks,
        });
    }
    catch (err) {
        console.error("Ошибка при получении задач:", err);
        return res.status(500).json({
            success: false,
            message: "Внутренняя ошибка сервера при получении задач",
        });
    }
});
// POST /api/tasks
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const { userId, title, description, dueDate, priority, color, remindAt } = body;
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
        const task = new Task_1.Task({
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
            task: saved,
        });
    }
    catch (err) {
        console.error("Ошибка при создании задачи:", err);
        return res.status(500).json({
            success: false,
            message: "Внутренняя ошибка сервера при создании задачи",
        });
    }
});
// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const update = {};
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
        const updated = await Task_1.Task.findByIdAndUpdate(id, update, {
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
            task: updated,
        });
    }
    catch (err) {
        console.error("Ошибка при обновлении задачи:", err);
        return res.status(500).json({
            success: false,
            message: "Внутренняя ошибка сервера при обновлении задачи",
        });
    }
});
// PATCH /api/tasks/:id/toggle
router.patch("/:id/toggle", async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task_1.Task.findById(id).exec();
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
            task,
        });
    }
    catch (err) {
        console.error("Ошибка при переключении статуса задачи:", err);
        return res.status(500).json({
            success: false,
            message: "Внутренняя ошибка сервера при изменении статуса задачи",
        });
    }
});
// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Task_1.Task.findByIdAndDelete(id).exec();
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
    }
    catch (err) {
        console.error("Ошибка при удалении задачи:", err);
        return res.status(500).json({
            success: false,
            message: "Внутренняя ошибка сервера при удалении задачи",
        });
    }
});
exports.default = router;
