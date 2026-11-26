import type { PublicAnimal } from "@pet-finder/shared";
import type { AnimalFormController } from "@/components/animals/form/shared/animal-form-shared.types";

export interface AnimalListItemProps {
  offerId: string;
  animal: PublicAnimal;
  editable: boolean;
}

export interface UseEditAnimalResult extends AnimalFormController {
  isEditing: boolean;
  startEditing: () => void;
}
