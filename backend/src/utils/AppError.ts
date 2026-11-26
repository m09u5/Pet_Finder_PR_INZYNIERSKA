import { HttpStatus } from "./httpStatus";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", code?: string) {
    super(HttpStatus.BAD_REQUEST, message, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", code?: string) {
    super(HttpStatus.UNAUTHORIZED, message, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code?: string) {
    super(HttpStatus.FORBIDDEN, message, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found", code?: string) {
    super(HttpStatus.NOT_FOUND, message, code);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", code?: string) {
    super(HttpStatus.CONFLICT, message, code);
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message = "Payload too large", code?: string) {
    super(HttpStatus.PAYLOAD_TOO_LARGE, message, code);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests", code?: string) {
    super(HttpStatus.TOO_MANY_REQUESTS, message, code);
  }
}
