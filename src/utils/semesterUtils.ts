/**
 * Parse a semester code like "S26" or "F25" into a sortable value.
 * Format: [F|S] + 2-digit year. Fall (F) comes after Spring (S) in the same year.
 */
export function semesterSortKey(code: string): number {
  const season = code.charAt(0); // 'F' or 'S'
  const year = parseInt(code.substring(1), 10);
  return year * 10 + (season === 'F' ? 1 : 0);
}

/**
 * Convert a semester code like "S26" to a human-readable label like "Spring 2026".
 */
export function semesterLabel(code: string): string {
  const season = code.charAt(0) === 'F' ? 'Fall' : 'Spring';
  const year = 2000 + parseInt(code.substring(1), 10);
  return `${season} ${year}`;
}
