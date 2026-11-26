export interface BreederDescriptionProps {
  description: string | null;
  editable?: boolean;
}

export interface UseEditDescriptionResult {
  isEditing: boolean;
  draft: string;
  error: string | null;
  saving: boolean;
  setDraft: (value: string) => void;
  startEditing: () => void;
  cancel: () => void;
  save: () => Promise<void>;
}
