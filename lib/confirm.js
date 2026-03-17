/**
 * Global confirm handler for API mutations (POST, PATCH, DELETE).
 * Set by ConfirmProvider; when unset, confirmation is skipped (e.g. SSR or before mount).
 */

let confirmHandler = null;

export function setConfirmHandler(fn) {
  confirmHandler = fn;
}

export function getConfirmHandler() {
  return confirmHandler;
}
