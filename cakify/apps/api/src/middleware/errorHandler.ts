import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";

export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof HttpError ? err.status : 500;
  const payload = {
    message: err.message || "Unexpected error",
    details: err instanceof HttpError ? err.details : undefined
  };

  if (status >= 500) {
    logger.error(err);
  }

  res.status(status).json(payload);
};
