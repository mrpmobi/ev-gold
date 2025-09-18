import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";

interface LabelSelectProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  errors?: Record<string, string>;
}

export function LabelSelect({
  id,
  label,
  value,
  onValueChange,
  options,
  errors = {},
}: LabelSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-start gap-1 flex-1 grow">
      <div className="relative w-full h-11">
        <Select
          value={value}
          onValueChange={onValueChange}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <SelectTrigger
            id={id}
            className="flex h-11 items-center gap-2 px-4 py-3 relative self-stretch w-full bg-white rounded-sm border border-solid border-greyscale-30 pt-4"
          >
            <Label
              htmlFor={id}
              className={`absolute left-4 transition-all duration-200 ease-in-out pointer-events-none ${
                isOpen || value
                  ? "top-1 text-xs text-greyscale-70 bg-white -translate-y-0"
                  : "top-1/2 text-sm text-greyscale-70 -translate-y-1/2"
              }`}
            >
              {label}
            </Label>

            <div className="flex-1 text-left pt-2">
              <SelectValue placeholder="" />
            </div>
          </SelectTrigger>

          <SelectContent className="z-200">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
