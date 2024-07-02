const COUNT_MAX = 100

type CountResult = {
  accessibilityLabel: string
  fullCountLabel: string
}

export function handleTooManyCount(count: number | null | undefined): CountResult {
  const hasTooMany = count !== null && count !== undefined && count >= COUNT_MAX
  const displayedCount = hasTooMany ? COUNT_MAX - 1 : count || '0'
  const plusSign = hasTooMany ? '+' : ''
  const accessibilityLabel = count !== null && count !== undefined ? count.toString() : '0'
  const fullCountLabel = `${displayedCount}${plusSign}`
  return { accessibilityLabel, fullCountLabel }
}
