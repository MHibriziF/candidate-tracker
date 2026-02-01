import { createError } from 'h3'

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
  message: string,
  statusCode = 500,
  cause?: any
) => {
  const err = createError({
    statusCode,
    message,
  })

  if (cause?.stack) {
    err.stack = cause.stack;     
  }

  if (cause) {
    (err as any).__cause = cause;
  }

  return err
}

export const Errors = {
  badRequest: (msg = 'Bad request') =>
    AppError(msg, 400),

  notFound: (msg = 'Not found') =>
    AppError(msg, 404),

  db: (err: any) =>
    AppError('Database error', 500, err),
}
