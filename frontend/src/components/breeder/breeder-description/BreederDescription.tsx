"use client";

import clsx from "clsx";
import { BreederDescriptionEditor } from "@/components/breeder/breeder-description-editor/BreederDescriptionEditor";
import { buttonClass } from "@/styles/theme";
import type { BreederDescriptionProps } from "./breeder-description.types";
import { useEditDescription } from "./useEditDescription";

export function BreederDescription({ description, editable }: BreederDescriptionProps) {
  const controller = useEditDescription(description);

  if (controller.isEditing) {
    return (
      <BreederDescriptionEditor
        draft={controller.draft}
        error={controller.error}
        saving={controller.saving}
        onChangeAction={controller.setDraft}
        onSaveAction={controller.save}
        onCancelAction={controller.cancel}
      />
    );
  }

  return (
    <>
      {description && <p className="text-gray-600 mt-2">{description}</p>}
      {editable && (
        <button
          type="button"
          onClick={controller.startEditing}
          className={clsx(buttonClass({ variant: "outline", size: "sm" }), "mt-2")}
        >
          Edytuj opis hodowli
        </button>
      )}
    </>
  );
}
