export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  // Для простоты пока строка, потом можем перейти на Date или ISO-строку из backend
  dueDate?: string;
  priority: TaskPriority;
  color?: string;
  isDone: boolean;
  remindAt?: string | null;
}
