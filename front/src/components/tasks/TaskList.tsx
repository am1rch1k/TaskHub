import type { Task, TaskPriority } from "../../types/task";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  onEditTask?: (task: Task) => void;
}

function getPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case "low":
      return "Низкий";
    case "medium":
      return "Средний";
    case "high":
      return "Высокий";
    default:
      return priority;
  }
}

function getPriorityClasses(priority: TaskPriority): string {
  switch (priority) {
    case "low":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    case "medium":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
    case "high":
      return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
    default:
      return "";
  }
}

export function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
        У вас пока нет задач. В следующих главах мы добавим форму создания
        задач.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-start gap-3 rounded-lg border bg-card/60 px-3 py-2 text-sm shadow-sm"
        >
          <button
            type="button"
            onClick={() => onToggleTask(task.id)}
            className={
              "mt-1 flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-150 " +
              (task.isDone
                ? "bg-black border-black"
                : "bg-white border-gray-400 hover:border-black hover:bg-gray-100")
            }
          >
            {task.isDone && (
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-3">
              <p
                className={
                  "font-medium " +
                  (task.isDone ? "line-through text-muted-foreground" : "")
                }
              >
                {task.title}
              </p>

              <span
                className={
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium " +
                  getPriorityClasses(task.priority)
                }
              >
                {getPriorityLabel(task.priority)}
              </span>
            </div>

            {task.description && (
              <p className="text-xs text-muted-foreground">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {task.dueDate && <span>Срок: {task.dueDate}</span>}
              {task.isDone && (
                <span className="text-emerald-500">Выполнено</span>
              )}

              <div className="ml-auto flex items-center gap-2">
                {onEditTask && (
                  <button
                    type="button"
                    onClick={() => onEditTask(task)}
                    className="text-primary hover:underline"
                  >
                    Редактировать
                  </button>
                )}
                {onDeleteTask && (
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="text-rose-500 hover:underline"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
