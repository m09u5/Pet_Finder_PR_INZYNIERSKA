import type { AnimalFormController } from "@/components/animals/form/shared/animal-form-shared.types";

export interface UseAddAnimalResult extends AnimalFormController {
  isOpen: boolean;
  open: () => void;
}
