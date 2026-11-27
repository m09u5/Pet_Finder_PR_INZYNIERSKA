import type { UseSelectedPhotosResult } from "@/components/animals/form/animal-photo-picker/animal-photo-picker.types";
import type { AnimalFormController } from "@/components/animals/form/shared/animal-form-shared.types";

export interface UseAddAnimalResult
  extends AnimalFormController,
    Pick<UseSelectedPhotosResult, "photos" | "addPhotos" | "removePhoto"> {
  isOpen: boolean;
  open: () => void;
}
