"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormInput({
  label,
  name,
  register,
  error,
  className,
  id,
  icon,
  ...props
}) {
  const inputId = id || name;
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={inputId}>{label}</Label>
      )}
      <div className="relative">
        <Input
          id={inputId}
          {...(register ? register(name) : { name })}
          aria-invalid={!!error}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            icon && "pr-10"
          )}
          {...props}
        />
        {icon && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground [&>svg]:size-4">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
