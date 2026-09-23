import { HttpErrorResponse } from '@angular/common/http';

const GLOBALLY_HANDLED_STATUSES = [0, 401, 403, 500];

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const message = error.error?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
}

export function isErrorHandledGlobally(error: unknown): boolean {
  return error instanceof HttpErrorResponse && GLOBALLY_HANDLED_STATUSES.includes(error.status);
}
