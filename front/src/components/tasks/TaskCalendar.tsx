import { useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ru } from "date-fns/locale";
import type { Task, TaskPriority } from "../../types/task";

const locales = {
  ru,
  "ru-RU": ru,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface TaskCalendarProps {
  tasks: Task[];
}

interface TaskEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  priority: TaskPriority;
  isDone: boolean;
}

function getPriorityColor(priority: TaskPriority, isDone: boolean): string {
  if (isDone) {
    return "#16a34a"; // зелёный для выполненных
  }

  switch (priority) {
    case "high":
      return "#dc2626"; // красный
    case "medium":
      return "#f97316"; // оранжевый
    case "low":
    default:
      return "#2563eb"; // синий
  }
}

const messages = {
  today: "Сегодня",
  previous: "Назад",
  next: "Вперёд",
  month: "Месяц",
  week: "Неделя",
  day: "День",
  agenda: "Повестка",
  date: "Дата",
  time: "Время",
  event: "Событие",
  noEventsInRange: "Нет задач в выбранном диапазоне",
};

export function TaskCalendar({ tasks }: TaskCalendarProps) {
  const events: TaskEvent[] = useMemo(
    () =>
      tasks
        .filter((task) => task.dueDate) // только задачи с датой
        .map((task) => {
          // преобразуем YYYY-MM-DD в Date
          const date = new Date(task.dueDate as string);

          return {
            id: task.id,
            title: task.title,
            start: date,
            end: date,
            allDay: true,
            priority: task.priority,
            isDone: task.isDone,
          };
        }),
    [tasks]
  );

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      views={["month", "week", "day"]}
      defaultView="month"
      popup
      culture="ru"
      messages={messages}
      eventPropGetter={(event: TaskEvent) => {
        const backgroundColor = getPriorityColor(event.priority, event.isDone);

        return {
          style: {
            backgroundColor,
            color: "#ffffff",
            borderRadius: "9999px",
            border: "none",
            fontSize: "11px",
            padding: "2px 6px",
          },
        };
      }}
    />
  );
}
