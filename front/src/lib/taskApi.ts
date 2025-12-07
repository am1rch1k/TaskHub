import { api } from "./apiClient";
import type { Task } from "../types/task";
import type { TaskFormValues } from "../components/tasks/TaskForm";

interface ApiTask {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Task["priority"];
  color?: string;
  isDone: boolean;
  remindAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksListResponse {
  success: boolean;
  tasks: ApiTask[];
  message?: string;
}

interface TaskSingleResponse {
  success: boolean;
  task: ApiTask;
  message?: string;
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

function mapApiTask(task: ApiTask): Task {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    color: task.color,
    isDone: task.isDone,
    remindAt: task.remindAt,
  };
}

export async function fetchTasks(userId: string): Promise<Task[]> {
  const res = await api.get<TasksListResponse>(
    `/api/tasks?userId=${encodeURIComponent(userId)}`
  );
  if (!res.success) {
    throw new Error(res.message ?? "Не удалось получить задачи");
  }
  return res.tasks.map(mapApiTask);
}

export async function createTask(
  userId: string,
  values: TaskFormValues
): Promise<Task> {
  const res = await api.post<TaskSingleResponse>("/api/tasks", {
    userId,
    title: values.title,
    description: values.description || undefined,
    dueDate: values.dueDate || undefined,
    priority: values.priority,
  });

  if (!res.success) {
    throw new Error(res.message ?? "Не удалось создать задачу");
  }

  return mapApiTask(res.task);
}

export async function toggleTask(id: string): Promise<Task> {
  const res = await api.patch<TaskSingleResponse>(`/api/tasks/${id}/toggle`);
  if (!res.success) {
    throw new Error(res.message ?? "Не удалось изменить статус задачи");
  }
  return mapApiTask(res.task);
}

export async function deleteTask(id: string): Promise<void> {
  const res = await api.delete<DeleteResponse>(`/api/tasks/${id}`);
  if (!res.success) {
    throw new Error(res.message ?? "Не удалось удалить задачу");
  }
}

export async function updateTask(
  id: string,
  values: TaskFormValues
): Promise<Task> {
  const res = await api.put<TaskSingleResponse>(`/api/tasks/${id}`, {
    title: values.title,
    description: values.description || undefined,
    dueDate: values.dueDate || undefined,
    priority: values.priority,
  });

  if (!res.success) {
    throw new Error(res.message ?? "Не удалось обновить задачу");
  }

  return mapApiTask(res.task);
}
