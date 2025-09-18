import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React from "react";

interface StringToggleGroupProps {
  filter: string;
  options: { label: string; value: string }[];
  onChange: (value: string | undefined) => void;
  label?: string;
}

export function StringToggleGroup({
  filter,
  onChange,
  options,
  label,
}: StringToggleGroupProps) {
  return (
    <div>
      <Label
        className={
          "left-4 top-1 text-xs text-greyscale-70"
        }
      >
        {label}
      </Label>
      <ToggleGroup
        type="single"
        value={filter}
        onValueChange={onChange}
        className="inline-flex items-center justify-center gap-1 p-2 relative flex-[0_0_auto] rounded-[99px] overflow-hidden border border-solid border-[#42424280]"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className={`inline-flex justify-center px-2 py-1 flex-[0_0_auto] rounded-[49px] items-center gap-2.5 relative overflow-hidden h-auto hover:bg-[#424242] ${
              filter === option.value
                ? "bg-primary shadow-[0px_9px_40px_#ff9649] data-[state=on]:bg-primary"
                : "data-[state=on]:bg-primary"
            }`}
          >
            <div
              className={`relative w-fit mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-[length:var(--h2-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)] ${
                filter === option.value
                  ? "text-primaryblack"
                  : "text-greyscale-50"
              }`}
            >
              {option.label}
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
