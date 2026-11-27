import { ALLOWED_IMAGE_TYPES } from "@pet-finder/shared";
import clsx from "clsx";
import { iconButtonClass } from "@/styles/theme";
import type { IconUploadButtonProps } from "./icon-upload-button.types";

export function IconUploadButton({ label, multiple, disabled, onSelectAction, children }: IconUploadButtonProps) {
  return (
    <label
      title={label}
      className={iconButtonClass({
        className: clsx(
          "cursor-pointer focus-within:ring-2 focus-within:ring-emerald-600",
          disabled && "opacity-50 pointer-events-none",
        ),
      })}
    >
      {children}
      <input
        type="file"
        aria-label={label}
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (files.length > 0) onSelectAction(files);
        }}
      />
    </label>
  );
}
