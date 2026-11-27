import clsx from "clsx";
import type { ButtonClassOptions, IconButtonClassOptions } from "./theme.types";

export const bodyClass = clsx("min-h-full flex flex-col bg-background text-foreground");

export const containerClass = clsx("max-w-6xl mx-auto px-4");

export const surfaceBarClass = clsx("border-b border-gray-200 bg-white");

export const navLinkClass = clsx("text-gray-700 hover:text-gray-900");

export const fieldClass = clsx("border border-gray-300 rounded px-3 py-2 text-gray-900");

export const pageClass = clsx("p-6");

export const narrowPageClass = clsx("max-w-2xl mx-auto p-6");

export const pageTitleClass = clsx("text-xl mb-4");

export const offerPageClass = clsx("w-full max-w-6xl mx-auto px-4 py-4");

export const offerPanelClass = clsx("bg-[#f3f2f8] rounded-2xl overflow-hidden");

export const whiteBoxClass = clsx("bg-white rounded-2xl p-4");

export const panelClass = clsx("w-full max-w-sm mx-auto mt-12 p-6 border border-gray-200 rounded");

export const listClass = clsx("flex flex-col gap-2");

export const listCardClass = clsx("border border-gray-200 rounded p-3 flex justify-between items-center gap-3");

export const statusBadgeClass = clsx("inline-block px-3 py-1 rounded-full text-sm whitespace-nowrap");

export const detailRowClass = clsx("flex justify-between gap-4 border-b border-gray-100 py-2 last:border-b-0");

export const mutedTextClass = clsx("text-sm text-gray-500");

export const errorTextClass = clsx("text-sm text-red-600 whitespace-pre-line");

export function floatingMessageClass(className?: string) {
  return clsx("absolute top-full right-0 mt-1 w-44 z-10 bg-white rounded-lg shadow p-2 text-xs", className);
}

export function iconButtonClass({ tone = "default", className }: IconButtonClassOptions = {}) {
  return clsx(
    "inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-white shadow-sm border border-gray-200",
    "hover:bg-gray-50",
    tone === "default" && "text-gray-700",
    tone === "danger" && "text-red-600",
    className,
  );
}

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
