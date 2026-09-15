import { z } from "zod";

export const createReservationSchema = z.object({
  animalId: z.string().min(1, "animalId jest wymagany"),
});
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
