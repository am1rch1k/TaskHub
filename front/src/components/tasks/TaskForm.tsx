import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string; // "YYYY-MM-DD" или ""
  priority: TaskPriority;
  remindAt?: string; // "YYYY-MM-DDTHH:mm" или ""
}

interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  initialValues?: Partial<TaskFormValues>;
  submitLabel?: string;
  onCancel?: () => void;
  resetOnSubmit?: boolean;
}

// помощник для date input (если придёт ISO вида 2025-12-13T00:00:00.000Z)
function normalizeDate(value?: string): string {
  if (!value) return "";
  if (value.includes("T")) return value.split("T")[0];
  return value;
}

// помощник для datetime-local (нужен формат YYYY-MM-DDTHH:mm)
function normalizeDateTime(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());

  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function TaskForm({
  onSubmit,
  initialValues,
  submitLabel = "Добавить задачу",
  onCancel,
  resetOnSubmit = true,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    dueDate: normalizeDate(initialValues?.dueDate),
    priority: initialValues?.priority ?? "medium",
    remindAt: normalizeDateTime(initialValues?.remindAt),
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload: TaskFormValues = {
      ...values,
      remindAt: values.remindAt ? values.remindAt : "",
    };

    await onSubmit(payload);

    if (resetOnSubmit) {
      setValues({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        remindAt: "",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-medium">Название</label>
        <Input
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Например, «Сдать курсовую на максимальный балл»"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Описание</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={3}
          className="flex w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Дополнительные детали задачи"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium">Срок выполнения</label>
          <Input
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Приоритет</label>
          <select
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Напомнить в</label>
        <Input
          name="remindAt"
          type="datetime-local"
          value={values.remindAt ?? ""}
          onChange={handleChange}
        />
        <p className="text-[11px] text-muted-foreground">
          Время, когда приложение напомнит вам об этой задаче (локально, через
          всплывающее сообщение).
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" className="h-8 px-3 text-xs">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="h-8 px-3 text-xs"
          >
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}
