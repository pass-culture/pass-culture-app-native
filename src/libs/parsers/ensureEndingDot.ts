export function ensureEndingDot(description: string): string {
  const trimmed = description.trim()
  if (!trimmed) return description
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}
