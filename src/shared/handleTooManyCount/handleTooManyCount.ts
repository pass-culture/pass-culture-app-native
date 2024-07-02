const COUNT_MAX = 100

export function handleTooManyCount(count: number | null | undefined): string {
  const hasTooMany = count !== null && count !== undefined && count >= COUNT_MAX
  const displayedCount = hasTooMany ? COUNT_MAX - 1 : count || '0'
  const plusSign = hasTooMany ? '+' : ''
  return `${displayedCount}${plusSign}`
}
