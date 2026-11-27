const DEPOSIT_RATE = 0.1;

export function calculateDeposit(price: number) {
  return Math.round(price * DEPOSIT_RATE * 100) / 100;
}
