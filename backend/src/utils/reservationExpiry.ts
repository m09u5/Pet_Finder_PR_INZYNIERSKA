const PAYMENT_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

export function getPaymentDeadline(createdAt: Date) {
  return new Date(createdAt.getTime() + PAYMENT_WINDOW_MS);
}

export function getExpiryCutoff(now = new Date()) {
  return new Date(now.getTime() - PAYMENT_WINDOW_MS);
}
