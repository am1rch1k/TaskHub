import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { authActionStyle } from "../../components/auth/authActionStyle";
import type { Task } from "../../types/task";
import { getStoredUser } from "../../lib/authStorage";
import {
  fetchTasks,
  createTask,
  toggleTask,
  deleteTask as apiDeleteTask,
  updateTask as apiUpdateTask,
} from "../../lib/taskApi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { TaskList } from "../../components/tasks/TaskList";
import { TaskForm, type TaskFormValues } from "../../components/tasks/TaskForm";
import {
  TaskFilters,
  type TaskStatusFilter,
  type TaskPriorityFilter,
} from "../../components/tasks/TaskFilters";
import { TaskCalendar } from "../../components/tasks/TaskCalendar";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user] = useState(getStoredUser);
  const [isLoading, setIsLoading] = useState(Boolean(user));
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<TaskPriorityFilter>("all");

  const remindersTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!user) return;

    fetchTasks(user.id)
      .then((fetched) => {
        setTasks(fetched);
        setIsLoading(false);
      })
      .catch((err) => {
        setLoadError(
          err instanceof Error ? err.message : "Ошибка при загрузке задач"
        );
        setIsLoading(false);
      });
  }, [user]);

  function handleToggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isDone: !task.isDone } : task
      )
    );

    toggleTask(id).catch((err) => {
      console.error(err);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, isDone: !task.isDone } : task
        )
      );
    });
  }

  function handleDeleteTask(id: string) {
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((task) => task.id !== id));

    apiDeleteTask(id).catch((err) => {
      console.error(err);
      setTasks(prevTasks);
    });
  }

  async function handleAddTask(values: TaskFormValues) {
    if (!user) return;

    try {
      const newTask = await createTask(user.id, values);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Не удалось создать задачу");
    }
  }

  function handleStartEditTask(task: Task) {
    setEditingTask(task);
  }

  async function handleUpdateTask(values: TaskFormValues) {
    if (!editingTask) return;

    const id = editingTask.id;

    try {
      const updated = await apiUpdateTask(id, values);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingTask(null);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Не удалось обновить задачу");
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "active" && task.isDone) return false;
    if (statusFilter === "done" && !task.isDone) return false;

    if (priorityFilter !== "all" && task.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  // Напоминания по задачам (локальные таймеры в браузере)
  useEffect(() => {
    // сначала очищаем все старые таймеры
    remindersTimeoutsRef.current.forEach((id) => {
      window.clearTimeout(id);
    });
    remindersTimeoutsRef.current = [];

    const now = Date.now();

    tasks.forEach((task) => {
      if (!task.remindAt) return; // нет напоминания
      if (task.isDone) return; // выполненные не напоминаем

      const ts = new Date(task.remindAt).getTime();
      if (Number.isNaN(ts)) return;

      const delay = ts - now;
      if (delay <= 0) return; // время уже прошло

      // при желании можно ограничить, напр. только напоминания в ближайшие 7 дней
      // if (delay > 7 * 24 * 60 * 60 * 1000) return;

      const timeoutId = window.setTimeout(() => {
        alert(`Напоминание по задаче: "${task.title}"`);
      }, delay);

      remindersTimeoutsRef.current.push(timeoutId);
    });

    // на размонтирование или смену задач — тоже чистим таймеры
    return () => {
      remindersTimeoutsRef.current.forEach((id) => {
        window.clearTimeout(id);
      });
      remindersTimeoutsRef.current = [];
    };
  }, [tasks]);

  return (
    <div className="space-y-4">
      {/* Верхняя панель страницы */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Дашборд
          </h2>
          <p className="text-sm text-muted-foreground">
            {user
              ? "Здесь отображаются список задач и календарь."
              : "После входа здесь появятся ваши задачи и календарь."}
          </p>
        </div>

        {/* <div className="inline-flex items-center gap-2 rounded-full border bg-card p-1 text-xs">
          <Button
            type="button"
            variant={viewMode === "list" ? "primary" : "ghost"}
            className="rounded-full px-3 py-1"
            onClick={() => setViewMode("list")}
          >
            Список
          </Button>
          <Button
            type="button"
            variant={viewMode === "calendar" ? "primary" : "ghost"}
            className="rounded-full px-3 py-1"
            onClick={() => setViewMode("calendar")}
          >
            Календарь
          </Button>
        </div> */}
      </div>

      {!user && (
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Начните планировать задачи</h3>
            <p className="text-sm text-muted-foreground">
              Войдите или создайте аккаунт, чтобы пользоваться дашбордом.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/login" className={authActionStyle}>
              Войти
            </Link>
            <Link to="/register" className={authActionStyle}>
              Создать аккаунт
            </Link>
          </div>
        </div>
      )}

      {/* Основная сетка: слева список, справа календарь/детали */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
        {/* Левая колонка — список задач */}
        <Card className="min-h-[260px]">
          <CardHeader>
            <CardTitle>Список задач</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!user ? (
              <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                Войдите, чтобы увидеть свои задачи и добавить новую.
              </div>
            ) : isLoading ? (
              <p className="text-sm text-muted-foreground">Загрузка задач...</p>
            ) : loadError ? (
              <p className="text-sm text-red-500">{loadError}</p>
            ) : (
              <>
                <TaskFilters
                  status={statusFilter}
                  priority={priorityFilter}
                  onStatusChange={setStatusFilter}
                  onPriorityChange={setPriorityFilter}
                />

                <div className="rounded-xl border bg-muted/30 p-3">
                  <TaskForm onSubmit={handleAddTask} />
                </div>
                {editingTask && (
                  <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-3">
                    <div className="mb-2 text-xs text-muted-foreground">
                      Редактирование задачи:{" "}
                      <span className="font-medium">{editingTask.title}</span>
                    </div>
                    <TaskForm
                      onSubmit={handleUpdateTask}
                      initialValues={{
                        title: editingTask.title,
                        description: editingTask.description ?? "",
                        dueDate: editingTask.dueDate ?? "",
                        priority: editingTask.priority,
                        remindAt: editingTask.remindAt ?? "",
                      }}
                      submitLabel="Сохранить изменения"
                      onCancel={() => setEditingTask(null)}
                      resetOnSubmit={false}
                    />
                  </div>
                )}

                <TaskList
                  tasks={filteredTasks}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={handleStartEditTask}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Правая колонка — календарь */}
        <div className="space-y-4">
          <Card className="min-h-[180px]">
            <CardHeader>
              <CardTitle>Календарь задач</CardTitle>
              <CardDescription>
                Просматривайте свои задачи по датам в календаре.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <TaskCalendar tasks={tasks} />
              ) : (
                <div className="relative">
                  <div inert aria-hidden="true" className="pointer-events-none select-none opacity-40">
                    <TaskCalendar tasks={[]} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="rounded-lg border bg-card px-4 py-2 text-center text-sm font-medium shadow-sm">
                      Календарь доступен после входа
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
