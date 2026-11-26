export interface BreederDescriptionEditorProps {
  draft: string;
  error: string | null;
  saving: boolean;
  onChangeAction: (value: string) => void;
  onSaveAction: () => void;
  onCancelAction: () => void;
}
