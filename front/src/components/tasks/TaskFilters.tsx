import type { TaskPriority } from "../../types/task";

export type TaskStatusFilter = "all" | "active" | "done";
export type TaskPriorityFilter = "all" | TaskPriority;

interface TaskFiltersProps {
  status: TaskStatusFilter;
  priority: TaskPriorityFilter;
  onStatusChange: (value: TaskStatusFilter) => void;
  onPriorityChange: (value: TaskPriorityFilter) => void;
}

export function TaskFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
      <div className="inline-flex items-center gap-1 rounded-full border bg-card px-1 py-1 text-xs">
        <FilterChip
          isActive={status === "all"}
          onClick={() => onStatusChange("all")}
        >
          Все
        </FilterChip>
        <FilterChip
          isActive={status === "active"}
          onClick={() => onStatusChange("active")}
        >
          Активные
        </FilterChip>
        <FilterChip
          isActive={status === "done"}
          onClick={() => onStatusChange("done")}
        >
          Выполненные
        </FilterChip>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Приоритет:</span>
        <select
          value={priority}
          onChange={(e) =>
            onPriorityChange(e.target.value as TaskPriorityFilter)
          }
          className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <option value="all">Любой</option>
          <option value="high">Высокий</option>
          <option value="medium">Средний</option>
          <option value="low">Низкий</option>
        </select>
      </div>
    </div>
  );
}

interface FilterChipProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

function FilterChip({ isActive, children, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full px-3 py-1 transition-colors " +
        (isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
      }
    >
      {children}
    </button>
  );
}
