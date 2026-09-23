import { HttpErrorResponse } from '@angular/common/http';

// Statuses the auth interceptor already reports with its own snackbar.
const GLOBALLY_HANDLED_STATUSES = [0, 401, 403, 500];

/**
 * Returns the backend's error message ({ statusCode, message, ... }) when present,
 * otherwise the given fallback.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const message = error.error?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
}

/** True when the auth interceptor already showed a snackbar for this error. */
export function isErrorHandledGlobally(error: unknown): boolean {
  return error instanceof HttpErrorResponse && GLOBALLY_HANDLED_STATUSES.includes(error.status);
}
