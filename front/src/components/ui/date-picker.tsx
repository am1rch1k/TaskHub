import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "./calendar";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";

export interface DatePickerProps {
  value: string | null; // "YYYY-MM-DD" или null
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Выберите дату",
}: DatePickerProps) {
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return undefined;
    return d;
  }, [value]);

  function handleSelect(date?: Date) {
    if (!date) {
      onChange(null);
      return;
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    // Храним срок как "YYYY-MM-DD" — удобно и для бэка, и для фронта
    onChange(`${yyyy}-${mm}-${dd}`);
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          type="button"
          variant="ghost"
          className={
            "w-full justify-start text-left font-normal border border-input bg-background " +
            (!selectedDate ? "text-muted-foreground" : "")
          }
        >
          {selectedDate ? (
            format(selectedDate, "dd.MM.yyyy")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
