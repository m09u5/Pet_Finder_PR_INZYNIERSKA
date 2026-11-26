import type { VerificationStatus } from "@pet-finder/shared";
import type { ToggleOption } from "@/components/ui/toggle-group/toggle-group.types";

export const STATUS_OPTIONS: ToggleOption<VerificationStatus>[] = [
  { value: "PENDING", label: "PENDING" },
  { value: "VERIFIED", label: "VERIFIED" },
  { value: "REJECTED", label: "REJECTED" },
];
