export interface SelectedPhoto {
  file: File;
  previewUrl: string;
}

export interface AnimalPhotoPickerProps {
  photos: SelectedPhoto[];
  disabled: boolean;
  onAddAction: (files: File[]) => void;
  onRemoveAction: (previewUrl: string) => void;
}

export interface UseSelectedPhotosResult {
  photos: SelectedPhoto[];
  photoError: string | null;
  addPhotos: (files: File[]) => void;
  removePhoto: (previewUrl: string) => void;
  clearPhotos: () => void;
}
