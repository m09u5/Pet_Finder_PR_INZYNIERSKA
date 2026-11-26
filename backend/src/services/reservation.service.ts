import type { CreateReservationInput } from "@pet-finder/shared";
import { reservationRepository } from "../config/repositories";
import { requireFound } from "../utils/validators/found.validators";
import {
  assertAnimalReservable,
  assertPending,
  assertReservationAccess,
  assertReservationOfBreeder,
} from "../utils/validators/reservation.validators";

export async function createReservation(customerId: string, input: CreateReservationInput) {
  const { id } = await reservationRepository.reserveAnimal(input.animalId, customerId, assertAnimalReservable);
  return getReservationById(id);
}

export function listMyReservations(customerId: string) {
  return reservationRepository.listForCustomer(customerId);
}

export function listIncomingReservations(breederId: string) {
  return reservationRepository.listForBreeder(breederId);
}

export async function confirmReservation(reservationId: string, breederId: string) {
  const reservation = await getReservationById(reservationId);
  assertReservationOfBreeder(reservation, breederId);
  assertPending(reservation, "Można potwierdzić tylko oczekującą rezerwację");
  await reservationRepository.confirm(reservation);
  return getReservationById(reservationId);
}

export async function cancelReservation(reservationId: string, customerId: string, breederId: string | null) {
  const reservation = await getReservationById(reservationId);
  assertReservationAccess(reservation, customerId, breederId);
  assertPending(reservation, "Można anulować tylko oczekującą rezerwację");
  await reservationRepository.cancel(reservation);
  return getReservationById(reservationId);
}

async function getReservationById(reservationId: string) {
  return requireFound(await reservationRepository.findById(reservationId), "Rezerwacja nie istnieje");
}
