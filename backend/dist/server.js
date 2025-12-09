"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/tasks", tasks_1.default);
app.get("/api/ping", (_req, res) => {
    res.json({ message: "pong from backend" });
});
const PORT = process.env.PORT || 4000;
async function start() {
    await (0, db_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`Backend server started on port ${PORT}`);
    });
}
start().catch((err) => {
    console.error("Failed to start server:", err);
});
