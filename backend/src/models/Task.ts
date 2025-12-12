import { Schema, model } from "mongoose";

export type TaskPriority = "low" | "medium" | "high";

// Это наш интерфейс для кода / фронта, НЕ mongoose Document
export interface ITask {
  _id: string; // строковый id, удобно для фронта
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
  priority: TaskPriority;
  color?: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  remindAt?: Date | null;
}

// Mongoose-схема – без привязки к ITask, пусть TS не мешает
const taskSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    color: {
      type: String,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    remindAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// Модель – тоже без дженериков, тип будем контролировать сами
export const Task = model("Task", taskSchema);
