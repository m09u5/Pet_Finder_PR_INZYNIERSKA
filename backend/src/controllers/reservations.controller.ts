import type { Request, Response } from "express";
import type { CreateReservationInput } from "@pet-finder/shared";
import * as reservationService from "../services/reservation.service";
import { NotFoundError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { toPublicReservation } from "../utils/publicReservation";

export const createReservation = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateReservationInput;
  const reservation = await reservationService.createReservation(req.user!.id, input);
  if (!reservation) {
    throw new NotFoundError("Rezerwacja nie istnieje");
  }
  res.status(201).json({ reservation: toPublicReservation(reservation) });
});

export const listMyReservations = asyncHandler(async (req: Request, res: Response) => {
  const reservations = await reservationService.listMyReservations(req.user!.id);
  res.json({ reservations: reservations.map(toPublicReservation) });
});

export const listIncomingReservations = asyncHandler(async (req: Request, res: Response) => {
  const reservations = await reservationService.listIncomingReservations(req.breederProfile!.id);
  res.json({ reservations: reservations.map(toPublicReservation) });
});

export const confirmReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.confirmReservation(req.params.id, req.breederProfile!.id);
  if (!reservation) {
    throw new NotFoundError("Rezerwacja nie istnieje");
  }
  res.json({ reservation: toPublicReservation(reservation) });
});

export const cancelReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.cancelReservation(
    req.params.id,
    req.user!.id,
    req.breederProfile?.id ?? null,
  );
  if (!reservation) {
    throw new NotFoundError("Rezerwacja nie istnieje");
  }
  res.json({ reservation: toPublicReservation(reservation) });
});
