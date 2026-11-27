export interface ImageUploaderProps {
  uploadUrl: string;
}

export interface UseImageUploadResult {
  uploading: boolean;
  error: string | null;
  upload: (files: File[]) => Promise<void>;
}
