import multer from "multer";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 10;

export const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILES },
}).array("images", MAX_FILES);
