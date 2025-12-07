import express from "express";
import type { Request, Response } from "express";
import { User } from "../models/User";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password, name } = req.body as {
      username?: string;
      password?: string;
      name?: string;
    };

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Логин и пароль обязательны",
      });
    }

    // Проверяем, что логин уникален
    const existing = await User.findOne({ username }).exec();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Пользователь с таким логином уже существует",
      });
    }

    const user = new User({
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
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Логин и пароль обязательны",
      });
    }

    const user = await User.findOne({ username }).exec();

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

export default router;
