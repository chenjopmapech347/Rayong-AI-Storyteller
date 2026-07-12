// src/constants/config.js
// ─── App-level constants ──────────────────────────────────────────────────────
// Centralise values that appear in multiple files so they can be changed in
// ONE place without risk of the files getting out of sync.

/** Firebase Auth email suffix for users whose username is not an email address. */
export const EMAIL_DOMAIN = '@eco.com';

/** Firebase Hosting URL for this app (used in portfolio / public links). */
export const APP_URL = 'https://ai-storyteller-9dc3a.web.app';

/** localStorage key used to persist the logged-in user across page reloads. */
export const STORAGE_KEY = 'eco_user';
