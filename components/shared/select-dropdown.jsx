"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SelectDropdown({
  label,
  value,
  onValueChange,
  options = [],
  placeholder = "Select...",
  className,
  error,
  id,
  ...props
}) {
  const selectId = id || "select";
  // Radix Select reserves empty string for clearing selection; exclude from options
  const safeOptions = options.filter((opt) => opt.value !== "");
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <Select
        value={value === "" ? undefined : value}
        onValueChange={onValueChange}
        {...props}
      >
        <SelectTrigger id={selectId} className={cn(error && "border-destructive")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {safeOptions.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
