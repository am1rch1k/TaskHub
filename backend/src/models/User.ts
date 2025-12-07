import { Schema, model, type Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string; // учебный проект — без хэша
  name?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      // В реальном проекте тут был бы хэш
    },
    name: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const User = model<IUser>("User", userSchema);
