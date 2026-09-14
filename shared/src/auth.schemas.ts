import { z } from "zod";
import { UserRole } from "./enums";

export const emailSchema = z.string().trim().toLowerCase().email("Nieprawidłowy adres e-mail");
export const passwordSchema = z
  .string()
  .min(8, "Hasło musi mieć co najmniej 8 znaków")
  .max(72, "Hasło jest za długie");

const baseRegisterFields = {
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().trim().min(1, "Imię jest wymagane").max(100),
  lastName: z.string().trim().min(1, "Nazwisko jest wymagane").max(100),
  phone: z
    .string()
    .trim()
    .min(6, "Numer telefonu jest za krótki")
    .max(20)
    .optional(),
};

const breederProfileSchema = z.object({
  breedingName: z.string().trim().min(2, "Nazwa hodowli jest wymagana").max(150),
  description: z.string().trim().max(2000).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const registerSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal(UserRole.CUSTOMER),
    ...baseRegisterFields,
  }),
  z.object({
    role: z.literal(UserRole.BREEDER),
    ...baseRegisterFields,
    breederProfile: breederProfileSchema,
  }),
]);
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Hasło jest wymagane"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({ email: emailSchema });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resendVerificationSchema = z.object({ email: emailSchema });
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(10, "Nieprawidłowy token"),
  newPassword: passwordSchema,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const verifyEmailQuerySchema = z.object({
  token: z.string().min(10, "Nieprawidłowy token"),
});
export type VerifyEmailQuery = z.infer<typeof verifyEmailQuerySchema>;
