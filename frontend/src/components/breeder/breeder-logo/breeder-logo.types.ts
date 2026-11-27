export interface BreederLogoProps {
  logoUrl: string | null;
  breedingName: string;
  editable?: boolean;
}

export interface UseBreederLogoResult {
  saving: boolean;
  error: string | null;
  upload: (files: File[]) => Promise<void>;
  remove: () => Promise<void>;
}
