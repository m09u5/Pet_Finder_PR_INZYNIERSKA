import type { Request, Response } from "express";
import type { CreateReservationInput } from "@pet-finder/shared";
import * as reservationService from "../services/reservation.service";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpStatus } from "../utils/httpStatus";
import { toPublicReservation } from "../utils/publicReservation";

export const createReservation = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateReservationInput;
  const reservation = await reservationService.createReservation(req.user!.id, input);
  res.status(HttpStatus.CREATED).json({ reservation: toPublicReservation(reservation) });
});

export const listMyReservations = asyncHandler(async (req: Request, res: Response) => {
  const reservations = await reservationService.listMyReservations(req.user!.id);
  res.status(HttpStatus.OK).json({ reservations: reservations.map(toPublicReservation) });
});

export const listIncomingReservations = asyncHandler(async (req: Request, res: Response) => {
  const reservations = await reservationService.listIncomingReservations(req.breederProfile!.id);
  res.status(HttpStatus.OK).json({ reservations: reservations.map(toPublicReservation) });
});

export const confirmReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.confirmReservation(req.params.id, req.breederProfile!.id);
  res.status(HttpStatus.OK).json({ reservation: toPublicReservation(reservation) });
});

export const cancelReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.cancelReservation(
    req.params.id,
    req.user!.id,
    req.breederProfile?.id ?? null,
  );
  res.status(HttpStatus.OK).json({ reservation: toPublicReservation(reservation) });
});
