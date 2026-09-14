export const UserRole = {
  CUSTOMER: "CUSTOMER",
  BREEDER: "BREEDER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const VerificationStatus = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const;
export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];

export const AnimalSex = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;
export type AnimalSex = (typeof AnimalSex)[keyof typeof AnimalSex];

export const AnimalStatus = {
  AVAILABLE: "AVAILABLE",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
} as const;
export type AnimalStatus = (typeof AnimalStatus)[keyof typeof AnimalStatus];

export const OfferStatus = {
  ACTIVE: "ACTIVE",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
  INACTIVE: "INACTIVE",
} as const;
export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];

export const ReservationStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;
export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus];
