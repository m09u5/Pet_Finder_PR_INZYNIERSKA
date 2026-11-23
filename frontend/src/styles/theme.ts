import clsx from "clsx";
import type { ButtonClassOptions } from "./theme.types";

export const bodyClass = clsx("min-h-full flex flex-col bg-background text-foreground");

export const containerClass = clsx("max-w-6xl mx-auto px-4");

export const surfaceBarClass = clsx("border-b border-gray-200 bg-white");

export const navLinkClass = clsx("text-gray-700 hover:text-gray-900");

export const fieldClass = clsx("border border-gray-300 rounded px-3 py-2 text-gray-900");

export function buttonClass({ variant = "primary", size = "md", fullWidth = false, className }: ButtonClassOptions = {}) {
  return clsx(
    "inline-flex items-center justify-center gap-1.5 rounded-full text-sm whitespace-nowrap",
    variant === "primary" && "bg-emerald-600 hover:bg-emerald-700 text-white font-medium",
    variant === "outline" && "border border-gray-300 text-gray-700 hover:bg-gray-50",
    size === "sm" && "px-3 py-1.5",
    size === "md" && "px-4 py-2",
    fullWidth && "w-full",
    className,
  );
}
