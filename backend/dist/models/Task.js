"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true, // createdAt + updatedAt
});
exports.Task = (0, mongoose_1.model)("Task", taskSchema);
