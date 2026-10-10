// ─── Formatting utilities ────────────────────────────────────────────────────

/**
 * Format a paisa amount (integer 1/100 NPR) as a localized NPR currency string.
 * e.g. 250000 → "NPR 2,500.00"
 */
export function formatMoney(paisa: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
  }).format(paisa / 100);
}

/**
 * Format an ISO date string to a short human-readable date.
 * e.g. "2026-03-15T10:00:00Z" → "Mar 15, 2026"
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-NP', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Extract a readable error message from an unknown caught value.
 * Handles axios-style response errors and plain Error instances.
 */
export function extractErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: { error?: string } };
    message?: string;
  };
  return err?.response?.data?.error ?? err?.message ?? 'Please try again.';
}
