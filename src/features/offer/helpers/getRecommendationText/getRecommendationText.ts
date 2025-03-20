export function getRecommendationText(headlineOffersCount: number) {
  if (headlineOffersCount === 0) return ''
  return `Recommandé par ${headlineOffersCount} lieu${headlineOffersCount > 1 ? 'x culturels' : ' culturel'}`
}
