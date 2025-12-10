import { Router, type Request, type Response } from "express";
import { User } from "../models/User";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, name } = req.body ?? {};

  if (!username || !password) {
    res
      .status(400)
      .json({ success: false, message: "Логин и пароль обязательны" });
    return;
  }

  try {
    const existing = await User.findOne({ username }).exec();
    if (existing) {
      res.status(400).json({
        success: false,
        message: "Пользователь с таким логином уже существует",
      });
      return;
    }

    const user = new User({ username, password, name });
    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name ?? null,
      },
    });
  } catch (err) {
    console.error("Ошибка регистрации:", err);
    res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при регистрации",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    res
      .status(400)
      .json({ success: false, message: "Логин и пароль обязательны" });
    return;
  }

  try {
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
      res
        .status(401)
        .json({ success: false, message: "Неверный логин или пароль" });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name ?? null,
      },
    });
  } catch (err) {
    console.error("Ошибка входа:", err);
    res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при входе",
    });
  }
});

export default router;
