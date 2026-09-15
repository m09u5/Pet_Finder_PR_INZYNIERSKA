import { z } from "zod";
import { VerificationStatus } from "./enums";

export const listBreedersQuerySchema = z.object({
  status: z.nativeEnum(VerificationStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListBreedersQuery = z.infer<typeof listBreedersQuerySchema>;

export const updateVerificationStatusSchema = z.object({
  status: z.enum([VerificationStatus.VERIFIED, VerificationStatus.REJECTED]),
});
export type UpdateVerificationStatusInput = z.infer<typeof updateVerificationStatusSchema>;

export const updateBreederProfileSchema = z.object({
  description: z.string().trim().max(2000).optional(),
});
export type UpdateBreederProfileInput = z.infer<typeof updateBreederProfileSchema>;
