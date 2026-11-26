import clsx from "clsx";
import type { ButtonClassOptions } from "./theme.types";

export const bodyClass = clsx("min-h-full flex flex-col bg-background text-foreground");

export const containerClass = clsx("max-w-6xl mx-auto px-4");

export const surfaceBarClass = clsx("border-b border-gray-200 bg-white");

export const navLinkClass = clsx("text-gray-700 hover:text-gray-900");

export const fieldClass = clsx("border border-gray-300 rounded px-3 py-2 text-gray-900");

export const pageClass = clsx("p-6");

export const narrowPageClass = clsx("max-w-2xl mx-auto p-6");

export const pageTitleClass = clsx("text-xl mb-4");

export const panelClass = clsx("w-full max-w-sm mx-auto mt-12 p-6 border border-gray-200 rounded");

export const listClass = clsx("flex flex-col gap-2");

export const listCardClass = clsx("border border-gray-200 rounded p-3 flex justify-between items-center gap-3");

export const mutedTextClass = clsx("text-sm text-gray-500");

export const errorTextClass = clsx("text-sm text-red-600");

export function buttonClass({ variant = "primary", size = "md", fullWidth = false, className }: ButtonClassOptions = {}) {
  return clsx(
    "inline-flex items-center justify-center gap-1.5 rounded-full text-sm whitespace-nowrap disabled:opacity-50",
    variant === "primary" && "bg-emerald-600 hover:bg-emerald-700 text-white font-medium",
    variant === "outline" && "border border-gray-300 text-gray-700 hover:bg-gray-50",
    variant === "danger" && "bg-red-600 hover:bg-red-700 text-white font-medium",
    size === "sm" && "px-3 py-1.5",
    size === "md" && "px-4 py-2",
    fullWidth && "w-full",
    className,
  );
}
