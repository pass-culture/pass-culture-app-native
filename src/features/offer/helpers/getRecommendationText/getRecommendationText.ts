export function getRecommendationText(headlineOffersCount: number) {
  return `Recommandé par ${headlineOffersCount} lieu${headlineOffersCount > 1 ? 'x culturels' : ' culturel'}`
}
