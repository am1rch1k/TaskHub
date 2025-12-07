import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { TaskPriority } from "../../types/task";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
}

interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => void;
  initialValues?: Partial<TaskFormValues>;
  submitLabel?: string;
  onCancel?: () => void;
  resetOnSubmit?: boolean;
}

export function TaskForm({
  onSubmit,
  initialValues,
  submitLabel,
  onCancel,
  resetOnSubmit = true,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  // при открытии формы редактирования проставляем начальные значения
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title ?? "");
      setDescription(initialValues.description ?? "");
      setDueDate(initialValues.dueDate ?? "");
      setPriority(initialValues.priority ?? "medium");
    }
  }, [initialValues]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
    });

    if (resetOnSubmit) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
    }
  }

  const buttonText = submitLabel ?? "Добавить задачу";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="title">Название задачи</Label>
        <Input
          id="title"
          placeholder="Например: Сделать главу 34 курсовой"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Описание (необязательно)</Label>
        <textarea
          id="description"
          className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          placeholder="Кратко опишите задачу..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="dueDate">Срок выполнения</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="priority">Приоритет</Label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>
      </div>

      <div className={onCancel ? "flex gap-2" : ""}>
        <Button
          type="submit"
          fullWidth={!onCancel}
          className={onCancel ? "flex-1" : ""}
        >
          {buttonText}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}
