import clsx from "clsx";
import { buttonClass } from "@/styles/theme";
import type { ToggleGroupProps } from "./toggle-group.types";

export function ToggleGroup<Value extends string>({
  options,
  value,
  fullWidth = false,
  className,
  onChangeAction,
}: ToggleGroupProps<Value>) {
  return (
    <div className={clsx("flex gap-2", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChangeAction(option.value)}
          className={buttonClass({
            variant: option.value === value ? "primary" : "outline",
            className: fullWidth && "flex-1",
          })}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
