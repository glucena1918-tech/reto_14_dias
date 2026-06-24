import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  rightElement?: ReactNode;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, rightElement, label, className, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-base-content/70 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "glass-input w-full px-4 py-3 text-base-content placeholder:text-base-content/30 text-sm",
              icon && "pl-12",
              rightElement && "pr-12",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
