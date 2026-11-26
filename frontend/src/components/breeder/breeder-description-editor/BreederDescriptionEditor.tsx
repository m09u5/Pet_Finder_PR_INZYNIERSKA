import clsx from "clsx";
import { buttonClass, errorTextClass, fieldClass } from "@/styles/theme";
import type { BreederDescriptionEditorProps } from "./breeder-description-editor.types";

export function BreederDescriptionEditor({
  draft,
  error,
  saving,
  onChangeAction,
  onSaveAction,
  onCancelAction,
}: BreederDescriptionEditorProps) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <textarea
        value={draft}
        onChange={(event) => onChangeAction(event.target.value)}
        className={clsx(fieldClass, "min-h-24")}
        placeholder="Opis hodowli"
      />
      {error && <p className={errorTextClass}>{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={onSaveAction} disabled={saving} className={buttonClass({ size: "sm" })}>
          {saving ? "Zapisywanie..." : "Zapisz opis"}
        </button>
        <button
          type="button"
          onClick={onCancelAction}
          disabled={saving}
          className={buttonClass({ variant: "outline", size: "sm" })}
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}
