export interface ApiErrorBody {
  error?: {
    message?: string;
    code?: string;
    details?: Record<string, string[]>;
  };
}
