import { useEffect, useState } from "react";
import type { Task } from "../../types/task";
import type { AuthUser } from "../../types/auth";
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<TaskPriorityFilter>("all");

  useEffect(() => {
    const raw = localStorage.getItem("taskhub_user");
    if (!raw) {
      setIsLoading(false);
      setLoadError("Пользователь не найден. Пожалуйста, войдите заново.");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AuthUser;
      setUser(parsed);

      fetchTasks(parsed.id)
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
    } catch {
      setIsLoading(false);
      setLoadError("Ошибка чтения данных пользователя");
    }
  }, []);

  function handleToggleTask(id: string) {
    // оптимистично сразу меняем на фронте
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isDone: !task.isDone } : task
      )
    );

    // и отправляем запрос на бэк
    toggleTask(id).catch((err) => {
      console.error(err);
      // если ошибка — откатываем
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
      // откат, если ошибка
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

  return (
    <div className="space-y-4">
      {/* Верхняя панель страницы */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Личный кабинет
          </h2>
          <p className="text-sm text-muted-foreground">
            Здесь отображаются список задач и календарь по датам.
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

      {/* Основная сетка: слева список, справа календарь/детали */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
        {/* Левая колонка — список задач */}
        <Card className="min-h-[260px]">
          <CardHeader>
            <CardTitle>Список задач</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
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
              <TaskCalendar tasks={tasks} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
