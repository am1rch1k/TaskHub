"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
