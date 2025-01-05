export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; // Indicates if the error is a known operational error (as opposed to a system error)

      // Capturing the stack trace for better debugging
      Error.captureStackTrace(this, this.constructor);
    }
  }
