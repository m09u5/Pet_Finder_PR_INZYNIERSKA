"use client";

import Image from "next/image";
import { IconButton } from "@/components/ui/icon-button/IconButton";
import { IconUploadButton } from "@/components/ui/icon-upload-button/IconUploadButton";
import { CameraIcon } from "@/components/ui/icons/CameraIcon";
import { TrashIcon } from "@/components/ui/icons/TrashIcon";
import { floatingMessageClass } from "@/styles/theme";
import type { BreederLogoProps } from "./breeder-logo.types";
import { useBreederLogo } from "./useBreederLogo";

export function BreederLogo({ logoUrl, breedingName, editable }: BreederLogoProps) {
  const { saving, error, upload, remove } = useBreederLogo();

  return (
    <div className="relative w-28 h-28 shrink-0">
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-rose-200 flex items-center justify-center">
        {logoUrl ? (
          <Image src={logoUrl} alt={`Logo hodowli ${breedingName}`} fill sizes="112px" className="object-cover" />
        ) : (
          <span aria-hidden className="text-white text-5xl">
            {breedingName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {editable && (
        <div className="absolute -bottom-3 -right-3 flex gap-1">
          {logoUrl && (
            <IconButton label="Usuń logo" tone="danger" disabled={saving} onClickAction={remove}>
              <TrashIcon />
            </IconButton>
          )}
          <IconUploadButton label={logoUrl ? "Zmień logo" : "Dodaj logo"} disabled={saving} onSelectAction={upload}>
            <CameraIcon />
          </IconUploadButton>
        </div>
      )}

      {error && <p className={floatingMessageClass("text-red-600 mt-5")}>{error}</p>}
    </div>
  );
}
