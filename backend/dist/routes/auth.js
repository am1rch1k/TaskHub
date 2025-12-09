//Auth

"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const router = express_1.default.Router();
// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Логин и пароль обязательны",
      });
    }
    // Проверяем, что логин уникален
    const existing = await User_1.User.findOne({ username }).exec();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Пользователь с таким логином уже существует",
      });
    }
    const user = new User_1.User({
      username,
      password, // без хэша — учебный проект
      name,
    });
    await user.save();
    return res.status(201).json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name ?? null,
      },
    });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при регистрации",
    });
  }
});
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Логин и пароль обязательны",
      });
    }
    const user = await User_1.User.findOne({ username }).exec();
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Неверный логин или пароль",
      });
    }
    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name ?? null,
      },
    });
  } catch (err) {
    console.error("Ошибка при входе:", err);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при входе",
    });
  }
});
exports.default = router;
