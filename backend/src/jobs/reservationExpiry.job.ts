import { expireUnpaidReservations } from "../services/reservation.service";

const INTERVAL_MS = 60 * 1000;

export function startReservationExpiryJob() {
  const run = () =>
    expireUnpaidReservations().catch((error) => {
      console.error("Nie udało się wygasić nieopłaconych rezerwacji:", error);
    });

  void run();
  return setInterval(run, INTERVAL_MS);
}
