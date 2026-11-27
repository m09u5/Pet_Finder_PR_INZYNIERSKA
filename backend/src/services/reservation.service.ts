import type { CreateReservationInput, PayReservationInput } from "@pet-finder/shared";
import { reservationRepository } from "../config/repositories";
import { calculateDeposit } from "../utils/reservationDeposit";
import { getExpiryCutoff } from "../utils/reservationExpiry";
import { requireFound } from "../utils/validators/found.validators";
import {
  assertAnimalReservable,
  assertPaid,
  assertPaymentWindowOpen,
  assertPending,
  assertReservationAccess,
  assertReservationOfBreeder,
  assertReservationOfCustomer,
  assertStatusChanged,
  assertUnpaid,
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

export async function getMyReservation(reservationId: string, customerId: string) {
  const reservation = await getReservationById(reservationId);
  assertReservationOfCustomer(reservation, customerId);
  return reservation;
}

export async function payReservation(reservationId: string, customerId: string, input: PayReservationInput) {
  const reservation = await getMyReservation(reservationId, customerId);
  assertPending(reservation, "Można opłacić tylko aktywną rezerwację");
  assertUnpaid(reservation);
  assertPaymentWindowOpen(reservation);

  const paidAt = new Date();
  const payment = {
    pickupDate: new Date(input.pickupDate),
    depositAmount: calculateDeposit(reservation.animal.price.toNumber()),
    paidAt,
  };
  assertStatusChanged(await reservationRepository.pay(reservationId, payment, getExpiryCutoff(paidAt)));
  return getReservationById(reservationId);
}

export function expireUnpaidReservations() {
  return reservationRepository.expireUnpaid(getExpiryCutoff());
}

export async function confirmReservation(reservationId: string, breederId: string) {
  const reservation = await getReservationById(reservationId);
  assertReservationOfBreeder(reservation, breederId);
  assertPending(reservation, "Można potwierdzić tylko oczekującą rezerwację");
  assertPaid(reservation);
  assertStatusChanged(await reservationRepository.confirm(reservation));
  return getReservationById(reservationId);
}

export async function cancelReservation(reservationId: string, customerId: string, breederId: string | null) {
  const reservation = await getReservationById(reservationId);
  assertReservationAccess(reservation, customerId, breederId);
  assertPending(reservation, "Można anulować tylko oczekującą rezerwację");
  assertStatusChanged(await reservationRepository.cancel(reservation));
  return getReservationById(reservationId);
}

async function getReservationById(reservationId: string) {
  return requireFound(await reservationRepository.findById(reservationId), "Rezerwacja nie istnieje");
}
