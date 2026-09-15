interface ImageSignature {
  mimeType: string;
  extension: string;
  matches: (buffer: Buffer) => boolean;
}

const SIGNATURES: ImageSignature[] = [
  {
    mimeType: "image/jpeg",
    extension: "jpg",
    matches: (buffer) => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
  },
  {
    mimeType: "image/png",
    extension: "png",
    matches: (buffer) =>
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a,
  },
  {
    mimeType: "image/webp",
    extension: "webp",
    matches: (buffer) =>
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP",
  },
  {
    mimeType: "image/gif",
    extension: "gif",
    matches: (buffer) => {
      const header = buffer.toString("ascii", 0, 6);
      return header === "GIF87a" || header === "GIF89a";
    },
  },
];

export function detectImageType(buffer: Buffer): { mimeType: string; extension: string } | null {
  const signature = SIGNATURES.find((candidate) => candidate.matches(buffer));
  return signature ? { mimeType: signature.mimeType, extension: signature.extension } : null;
}
