import React, { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ru } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";

import type { Task } from "../../types/task";

// Локализация
const locales = {
  "ru-RU": ru,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Формат заголовка месяца: «декабрь 2025»
const formats = {
  monthHeaderFormat: "LLLL yyyy",
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  task: Task;
};

interface TaskCalendarProps {
  tasks: Task[];
}

export const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // события для календаря
  const events: CalendarEvent[] = useMemo(
    () =>
      tasks
        .filter((task) => task.dueDate)
        .map((task) => {
          const date = new Date(task.dueDate as string);

          return {
            id: task.id,
            title: task.title,
            start: date,
            end: date,
            allDay: true,
            task,
          };
        }),
    [tasks]
  );

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedDate(event.start);
  };

  // задачи на выбранный день
  const tasksForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];

    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);

    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      return d >= dayStart && d <= dayEnd;
    });
  }, [tasks, selectedDate]);

  // цвет событий
  const eventPropGetter = (event: CalendarEvent) => {
    const { task } = event;

    let backgroundColor = "#e5e7eb";
    if (task.priority === "high") backgroundColor = "#fee2e2";
    if (task.priority === "medium") backgroundColor = "#dbeafe";
    if (task.priority === "low") backgroundColor = "#dcfce7";
    if (task.isDone) backgroundColor = "#bbf7d0";

    return {
      style: {
        backgroundColor,
        color: "#111827",
        borderRadius: "9999px",
        border: "none",
        fontSize: "0.75rem",
        padding: "2px 6px",
        display: "flex",
        alignItems: "center",
      },
    };
  };

  const messages = {
    today: "Сегодня",
    previous: "Назад",
    next: "Вперёд",
    month: "Месяц",
    week: "Неделя",
    day: "День",
    agenda: "Список",
    date: "Дата",
    time: "Время",
    event: "Событие",
    noEventsInRange: "Нет задач на этот период",
  };

  return (
    <div className="flex flex-col gap-3 text-xs sm:text-sm">
      {/* Блок с календарём */}
      <div className="h-85 rounded-md border bg-background p-2 task-calendar">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate} //
          onNavigate={(date: Date, _view: any, action: any) => {
            setCurrentDate(date);

            // Если нажали "Сегодня" — показываем список задач на сегодня
            if (action === "TODAY") {
              setSelectedDate(date); // или new Date()
            } else if (action === "NEXT" || action === "PREV") {
              setSelectedDate(null);
            }
          }} //
          defaultView={Views.MONTH}
          views={[Views.MONTH]}
          culture="ru-RU"
          messages={messages}
          formats={formats}
          popup
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          drilldownView={null}
          eventPropGetter={eventPropGetter}
          style={{ height: "100%" }}
        />
      </div>

      {/* Блок со списком задач на выбранный день */}
      {selectedDate && (
        <div className="rounded-md border bg-muted/40 p-3">
          <div className="mb-2 text-xs font-medium sm:text-sm">
            Задачи на{" "}
            {format(selectedDate, "d MMMM yyyy", {
              locale: ru,
            })}
          </div>

          {tasksForSelectedDate.length === 0 ? (
            <div className="text-xs text-muted-foreground sm:text-sm">
              На этот день задач нет.
            </div>
          ) : (
            <ul className="ml-4 list-disc space-y-1">
              {tasksForSelectedDate.map((task) => (
                <li
                  key={task.id}
                  className={
                    task.isDone ? "line-through text-muted-foreground" : ""
                  }
                >
                  {task.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCalendar;
