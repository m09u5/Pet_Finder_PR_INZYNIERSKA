export interface ReserveButtonProps {
  animalId: string;
}

export interface UseReserveAnimalResult {
  reserve: () => Promise<void>;
  reserving: boolean;
  error: string | null;
}
