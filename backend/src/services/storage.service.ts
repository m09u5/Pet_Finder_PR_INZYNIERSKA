import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Storage } from "@google-cloud/storage";
import { env } from "../config/env";

const gcsConfigured = env.NODE_ENV !== "test" && Boolean(env.GCS_PROJECT_ID && env.GCS_BUCKET_NAME);

const gcsClient = gcsConfigured
  ? new Storage({ projectId: env.GCS_PROJECT_ID, keyFilename: env.GCS_KEY_FILE || undefined })
  : null;

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export interface UploadedImage {
  url: string;
  storagePath: string;
}

export async function uploadImage(
  buffer: Buffer,
  extension: string,
  mimeType: string,
  folder: string,
): Promise<UploadedImage> {
  const storagePath = `${folder}/${crypto.randomUUID()}.${extension}`;

  if (gcsClient) {
    const bucket = gcsClient.bucket(env.GCS_BUCKET_NAME!);
    await bucket.file(storagePath).save(buffer, { contentType: mimeType });
    return {
      url: `https://storage.googleapis.com/${env.GCS_BUCKET_NAME}/${storagePath}`,
      storagePath,
    };
  }

  const filePath = path.join(UPLOADS_DIR, storagePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
  return {
    url: `${env.BACKEND_URL}/uploads/${storagePath}`,
    storagePath,
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
