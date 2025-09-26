"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isValidDate(date: Date | null) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

interface DatePickerProps {
  onDateChange?: (date: Date | undefined) => void;
  dateValue?: Date | null;
  placeholder?: string;
  label?: string;
  [key: string]: any;
  id: string;
  errors?: Record<string, string>;
}

export function DatePicker({
  onDateChange,
  dateValue,
  errors = {},
  id,
  label,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>(
    formatDate(dateValue ?? undefined)
  );
  const [month, setMonth] = React.useState<Date | undefined>(
    dateValue ?? undefined
  );
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    setInputValue(formatDate(dateValue ?? undefined));
    setMonth(dateValue ?? undefined);
  }, [dateValue]);

  const handleDateChange = (newDate: Date | undefined) => {
    setInputValue(newDate ? formatDate(newDate) : "");
    setMonth(newDate ?? undefined);
    setOpen(false);

    if (onDateChange) {
      onDateChange(newDate ?? undefined);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length === 10 && value.includes("/")) {
      const parts = value.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        if (day > 0 && day <= 31 && month >= 0 && month <= 11 && year > 1900) {
          const newDate = new Date(year, month, day);
          if (isValidDate(newDate)) {
            handleDateChange(newDate);
            return;
          }
        }
      }
    }

    if (value === "") {
      handleDateChange(undefined);
    }
  };

  return (
    <div className="flex flex-col gap-3 flex-1 grow">
      <div className="relative flex gap-2">
        {/* Container para input e label */}
        <div className="relative flex-1">
          <Input
            {...props}
            id={id}
            value={inputValue}
            placeholder={props.placeholder || "dd/mm/aaaa"}
            className="flex h-11 items-center gap-2 px-4 py-3 pt-7 relative self-stretch w-full bg-primarywhite rounded-sm border border-solid border-greyscale-30 text-black"
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
              }
            }}
          />

          {label && (
            <Label
              htmlFor={id}
              className="absolute left-4 transition-all duration-200 ease-in-out pointer-events-none top-1 text-xs text-greyscale-70"
            >
              {label}
            </Label>
          )}
        </div>

        {/* Botão do calendário - posicionado absolutamente mas em relação ao container principal */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2 text-greyscale-70"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Selecionar data</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={dateValue ?? undefined}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateChange}
              modifiers={{ selected: dateValue ? [dateValue] : [] }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {errors[id] && (
        <div className="flex items-end flex-col gap-4 w-full">
          <Alert
            variant="destructive"
            className="flex gap-2 p-4 w-[343px] bg-[#fef2f2] rounded-sm border border-solid border-[#dc2626]"
          >
            <X className="w-4 h-4 mt-0.5" />
            <AlertDescription className="font-p-1 font-[number:var(--p-1-font-weight)] text-[length:var(--p-1-font-size)] tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] [font-style:var(--p-1-font-style)]">
              {errors[id]}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
