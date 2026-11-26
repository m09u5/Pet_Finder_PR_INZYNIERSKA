import type { PublicAnimal } from "@pet-finder/shared";

export interface AnimalActionsProps {
  animal: PublicAnimal;
  editable: boolean;
  onEditAction: () => void;
}
