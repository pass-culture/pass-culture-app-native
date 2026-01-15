const formatNumber = (value: number, unit: string, withDecimal = false) => {
  let formatted: string

  if (withDecimal) {
    // Round down to one decimal place
    const flooredValue = Math.floor(value * 10) / 10
    formatted =
      flooredValue % 1 === 0
        ? `${Math.floor(flooredValue)}`
        : flooredValue.toFixed(1).replace('.', ',')
  } else {
    // Round down to the nearest whole number
    formatted = `${Math.floor(value)}`
  }

  return `${formatted}${unit} j’aime`
}

export function formatLikesCounter(likesCounter: number): string {
  if (likesCounter < 1_000) return `${likesCounter} j’aime`

  if (likesCounter < 10_000) {
    return formatNumber(likesCounter / 1_000, 'k', true)
  }

  if (likesCounter < 1_000_000) {
    return formatNumber(likesCounter / 1_000, 'k')
  }

  if (likesCounter < 10_000_000) {
    return formatNumber(likesCounter / 1_000_000, 'M', true)
  }

  return formatNumber(likesCounter / 1_000_000, 'M')
}

export function getRecommendationText(headlineOffersCount: number) {
  if (headlineOffersCount === 0) return ''
  return `Recommandé par ${headlineOffersCount} lieu${headlineOffersCount > 1 ? 'x culturels' : ' culturel'}`
}
