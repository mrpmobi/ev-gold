import { ChangeEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LabelInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  disabled?: boolean;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export function LabelInput({ 
  id, 
  name, 
  value, 
  onChange, 
  label, 
  autoComplete = "off", 
  type = "text", 
  disabled = false, 
  isLoading , 
  errors = {},
  ...props
}: LabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full">
        <Input
          id={id}
          name={name}
          type={showSenha ? "text" : type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="border-greyscale-30 h-11 px-4 py-3 w-full bg-primarywhite rounded-sm border border-solid font-h4 font-[number:var(--h4-font-weight)] text-black text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)] pt-4"
          disabled={disabled}
          {...props}
        />
        <Label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-200 ease-in-out pointer-events-none ${
            isFocused || value 
              ? "top-1 text-xs text-greyscale-70" 
              : "top-3 text-sm text-greyscale-70"
          }`}
        >
          {label}
        </Label>

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowSenha(!showSenha)}
            className="absolute right-3 top-3 text-greyscale-70 hover:text-greyscale-90 transition-colors"
            disabled={isLoading}
          >
            {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {errors[name] && (
        <div className="flex items-end flex-col gap-4 w-full">
          <Alert
            variant="destructive"
            className="flex gap-2 p-4 w-[343px] bg-[#fef2f2] rounded-sm border border-solid border-[#dc2626]"
          >
            <X className="w-4 h-4 mt-0.5" />
            <AlertDescription className="font-p-1 font-[number:var(--p-1-font-weight)] text-[length:var(--p-1-font-size)] tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] [font-style:var(--p-1-font-style)]">
              {errors[name]}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}