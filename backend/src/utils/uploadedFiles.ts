import type { Request } from "express";

export function getUploadedFiles(req: Request) {
  return (req.files as Express.Multer.File[] | undefined) ?? [];
}
