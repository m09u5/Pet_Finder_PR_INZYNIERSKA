import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Storage } from "@google-cloud/storage";
import { env } from "../config/env";

const gcsConfigured = Boolean(env.GCS_PROJECT_ID && env.GCS_BUCKET_NAME && env.GCS_KEY_FILE);

const gcsClient = gcsConfigured
  ? new Storage({ projectId: env.GCS_PROJECT_ID, keyFilename: env.GCS_KEY_FILE })
  : null;

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export interface UploadedImage {
  url: string;
  storagePath: string;
}

export async function uploadImage(buffer: Buffer, extension: string, mimeType: string): Promise<UploadedImage> {
  const filename = `${crypto.randomUUID()}.${extension}`;

  if (gcsClient) {
    const storagePath = `images/${filename}`;
    const bucket = gcsClient.bucket(env.GCS_BUCKET_NAME!);
    await bucket.file(storagePath).save(buffer, { contentType: mimeType });
    return {
      url: `https://storage.googleapis.com/${env.GCS_BUCKET_NAME}/${storagePath}`,
      storagePath,
    };
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return {
    url: `${env.BACKEND_URL}/uploads/${filename}`,
    storagePath: filename,
  };
}

export async function deleteImage(storagePath: string): Promise<void> {
  if (gcsClient) {
    await gcsClient.bucket(env.GCS_BUCKET_NAME!).file(storagePath).delete({ ignoreNotFound: true });
    return;
  }

  await fs.rm(path.join(UPLOADS_DIR, storagePath), { force: true });
}

export const isUsingRealGcs = gcsConfigured;
