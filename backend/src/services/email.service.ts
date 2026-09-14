import { Resend } from "resend";
import { env } from "../config/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {

    console.warn(`[email] RESEND_API_KEY not set — skipping send. Would send "${subject}" to ${to}`);
    return;
  }
  await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
}

export async function sendVerificationEmail(to: string, token: string) {
  const link = `${env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendEmail(
    to,
    "Potwierdź adres e-mail — Pet Finder",
    `<p>witaj!</p><p>Potwierdź swój adres e-mail, klikając w link poniżej:</p><p><a href="${link}">${link}</a></p><p>Link wygasa za 24 godziny.</p>`,
  );
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail(
    to,
    "Reset hasła — Pet Finder",
    `<p>Otrzymaliśmy prośbę o reset hasła.</p><p>Kliknij w link, aby ustawić nowe hasło:</p><p><a href="${link}">${link}</a></p><p>Link wygaśnie za godzinę. Jeśli nie wysylales prosby zignoruj wiadomosc.</p>`,
  );
}
