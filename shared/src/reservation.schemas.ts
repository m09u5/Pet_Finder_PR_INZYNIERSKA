import { z } from "zod";

export const PICKUP_MAX_DAYS_AHEAD = 90;

export function toDateOnly(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getPickupDateRange(now = new Date()) {
  const max = new Date(now);
  max.setDate(max.getDate() + PICKUP_MAX_DAYS_AHEAD);
  return { min: toDateOnly(now), max: toDateOnly(max) };
}

function isWithinPickupRange(value: string) {
  const { min, max } = getPickupDateRange();
  return value >= min && value <= max;
}

export const createReservationSchema = z.object({
  animalId: z.string().min(1, "animalId jest wymagany"),
});
export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const payReservationSchema = z.object({
  pickupDate: z
    .string()
    .date("Wybierz datę odbioru")
    .refine(isWithinPickupRange, `Data odbioru musi przypadać w ciągu najbliższych ${PICKUP_MAX_DAYS_AHEAD} dni`),
});
export type PayReservationInput = z.infer<typeof payReservationSchema>;
