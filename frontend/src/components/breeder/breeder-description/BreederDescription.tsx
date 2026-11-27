"use client";

import { BreederDescriptionEditor } from "@/components/breeder/breeder-description-editor/BreederDescriptionEditor";
import { IconButton } from "@/components/ui/icon-button/IconButton";
import { PencilIcon } from "@/components/ui/icons/PencilIcon";
import { mutedTextClass } from "@/styles/theme";
import type { BreederDescriptionProps } from "./breeder-description.types";
import { useEditDescription } from "./useEditDescription";

export function BreederDescription({ description, editable }: BreederDescriptionProps) {
  const controller = useEditDescription(description);

  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xl">O nas</h2>
        {editable && !controller.isEditing && (
          <IconButton label="Edytuj opis hodowli" onClickAction={controller.startEditing}>
            <PencilIcon />
          </IconButton>
        )}
      </div>

      {controller.isEditing ? (
        <BreederDescriptionEditor
          draft={controller.draft}
          error={controller.error}
          saving={controller.saving}
          onChangeAction={controller.setDraft}
          onSaveAction={controller.save}
          onCancelAction={controller.cancel}
        />
      ) : description ? (
        <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line break-words">{description}</p>
      ) : (
        <p className={mutedTextClass}>Hodowla nie dodała jeszcze opisu.</p>
      )}
    </section>
  );
}
