// Daily Bread cycles through 30 readings. Day 1 was 3 November 2026.
export const EPOCH = Date.UTC(2026, 10, 3);
export const CYCLE = 30;

/** Reading number (1 to 30) for a calendar date given as UTC year, month, day. */
export function dayNumber(y: number, m: number, d: number): number {
  const n = Math.floor((Date.UTC(y, m, d) - EPOCH) / 86400000);
  return (((n % CYCLE) + CYCLE) % CYCLE) + 1;
}
export const dayNumberForUTC = (d: Date) => dayNumber(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
export const dayNumberForLocal = (d: Date) => dayNumber(d.getFullYear(), d.getMonth(), d.getDate());
export const isoLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
