import { HttpErrorResponse } from '@angular/common/http';

/** Turns a backend error response into one readable message. */
export function errMsg(e: unknown): string {
  const err = e as HttpErrorResponse;
  if (!err || err.status === 0) return 'Cannot reach the server. Is the backend running?';
  const d = err.error;
  if (d && typeof d === 'object') {
    if (d.errors) return Object.values(d.errors).join(', ');
    if (d.message) return d.message;
  }
  return 'Something went wrong';
}
