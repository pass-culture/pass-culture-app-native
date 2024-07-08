const COUNT_MAX = 100

type CountResult = {
  displayedCount: string
  plusSign: string
}

export function handleTooManyCount(count: number | null | undefined): CountResult {
  const hasTooMany = count !== null && count !== undefined && count >= COUNT_MAX
  const displayedCount = hasTooMany ? (COUNT_MAX - 1).toString() : (count ?? '0').toString()
  const plusSign = hasTooMany ? '+' : ''
  return { displayedCount, plusSign }
}

type LabelResult = {
  fullCountLabel: string
  accessibilityLabel: string
}

export function createLabels(
  count: number | null | undefined,
  categorie: 'réservations' | 'favoris'
): LabelResult {
  const { displayedCount, plusSign } = handleTooManyCount(count)
  const fullCountLabel = `${displayedCount}${plusSign}`
  const accessibilityLabel = (count ?? 0) >= COUNT_MAX ? `Plus de 99 ${categorie}` : displayedCount

  return { fullCountLabel, accessibilityLabel }
}
