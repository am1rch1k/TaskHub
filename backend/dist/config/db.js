"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskhub";
async function connectDB() {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log("✅ MongoDB connected");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        // если не подключились к БД — дальше сервер поднимать смысла нет
        process.exit(1);
    }
}
