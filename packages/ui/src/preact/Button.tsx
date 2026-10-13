import type { ComponentChildren, JSX } from "preact";
import { cn } from "@repo/utils";

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  children: ComponentChildren;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "ui-btn",
        `ui-btn--${variant}`,
        `ui-btn--${size}`,
        typeof className === "string" ? className : undefined
      )}
      {...props}
    >
      {children}
    </button>
  );
}
