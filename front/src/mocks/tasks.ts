import type { Task } from "../types/task";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Подготовить план курсовой работы",
    description: "Структура глав, цели, задачи, используемые технологии.",
    dueDate: "2025-03-10",
    priority: "high",
    isDone: false,
  },
  {
    id: "2",
    title: "Сделать верстку страниц авторизации",
    description: "Login / Register, базовые формы и валидация на фронте.",
    dueDate: "2025-03-05",
    priority: "medium",
    isDone: true,
  },
  {
    id: "3",
    title: "Реализовать список задач на фронтенде",
    description: "Мок-данные, переключение статуса выполнения, приоритеты.",
    dueDate: "2025-03-12",
    priority: "high",
    isDone: false,
  },
  {
    id: "4",
    title: "Подключить календарь",
    description: "React Big Calendar и отображение задач по датам.",
    dueDate: "2025-03-20",
    priority: "low",
    isDone: false,
  },
];
