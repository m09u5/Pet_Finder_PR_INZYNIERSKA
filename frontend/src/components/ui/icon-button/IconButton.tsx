import clsx from "clsx";
import { iconButtonClass } from "@/styles/theme";
import type { IconButtonProps } from "./icon-button.types";

export function IconButton({ label, disabled, tone, className, onClickAction, children }: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClickAction}
      className={iconButtonClass({ tone, className: clsx("disabled:opacity-50", className) })}
    >
      {children}
    </button>
  );
}
