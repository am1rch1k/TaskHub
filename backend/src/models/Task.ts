import { Schema, model, type Document, type Types } from "mongoose";

export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
  color?: string;
  isDone: boolean;
  remindAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
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
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

export const Task = model<ITask>("Task", taskSchema);
