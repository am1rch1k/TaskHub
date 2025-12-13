import { api } from "./apiClient";
import type { Task } from "../types/task";

// 👇 маленький хелпер: вытаскиваем "data" если есть, иначе берём объект как есть
function unwrapData<T = any>(res: unknown): T {
  const anyRes = res as any;
  return (anyRes && anyRes.data ? anyRes.data : anyRes) as T;
}

// Получение задач пользователя
export async function fetchTasks(userId: string): Promise<Task[]> {
  const res = await api.get(`/api/tasks?userId=${encodeURIComponent(userId)}`);

  const data = unwrapData<{ success: boolean; tasks: Task[] }>(res);
  return data.tasks;
}

// Создание задачи
export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  color?: string;
  remindAt?: string | null;
}

export async function createTask(
  userId: string,
  values: CreateTaskPayload
): Promise<Task> {
  const res = await api.post("/api/tasks", {
    userId,
    ...values,
  });

  const data = unwrapData<{ success: boolean; task: Task }>(res);
  return data.task;
}

// Обновление задачи
export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  color?: string;
  isDone?: boolean;
  remindAt?: string | null;
}

export async function updateTask(
  id: string,
  values: UpdateTaskPayload
): Promise<Task> {
  const res = await api.put(`/api/tasks/${id}`, values);
  const data = unwrapData<{ success: boolean; task: Task }>(res);
  return data.task;
}

// Переключение статуса (выполнена/не выполнена)
export async function toggleTask(id: string): Promise<Task> {
  const res = await api.patch(`/api/tasks/${id}/toggle`);
  const data = unwrapData<{ success: boolean; task: Task }>(res);
  return data.task;
}

// Удаление задачи
export async function deleteTask(id: string): Promise<void> {
  const res = await api.delete(`/api/tasks/${id}`);
  // на всякий случай читаем ответ, но ничего не возвращаем
  unwrapData<{ success: boolean; message: string }>(res);
}
