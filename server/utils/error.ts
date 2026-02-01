import { createError } from "h3";

/**
 * Creates an error object with the given message and status code.
 * If a cause is provided, it will be attached to the error object.
 * If the cause has a stack property, it will be copied to the error object.
 *
 * @param {string} message - The error message.
 * @param {number} [statusCode=500] - The HTTP status code for the error.
 * @param {any} [cause] - The cause of the error.
 * @returns {Error} - The created error object.
 */
export const AppError = (
  statusCode = 500,
  statusMessage: string,
  message: string,
  cause?: any,
) => {
  const err = createError({
    statusCode,
    statusMessage,
    message,
  });

  if (cause?.stack) {
    err.stack = cause.stack;
  }

  if (cause) {
    (err as any).__cause = cause;
  }

  return err;
};

export const Errors = {
  badRequest: (msg = "Bad request", err?: any) =>
    AppError(400, "Bad request", msg, err),

  notFound: (msg = "Not found", err?: any) =>
    AppError(404, "Not found", msg, err),

  db: (msg = "Database error", err?: any) =>
    AppError(500, "Internal server error", msg, err),

  methodsNotAllowed: (msg = "Method not allowed", err?: any) =>
    AppError(405, "Method not allowed", msg, err),
};
