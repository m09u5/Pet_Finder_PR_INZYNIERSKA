import type { ChangeEvent } from "react";

export interface ImageUploaderProps {
  uploadUrl: string;
}

export interface UseImageUploadResult {
  uploading: boolean;
  error: string | null;
  upload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}
