import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'

export const getRecommendationEndpoint = (
  userId: number | undefined,
  position: GeoCoordinates | null
): string | undefined => {
  if (!userId) return undefined
  const endpoint = `${env.RECOMMENDATION_ENDPOINT}/playlist_recommendation/${userId}?token=${env.RECOMMENDATION_TOKEN}`
  if (position) return `${endpoint}&longitude=${position.longitude}&latitude=${position.latitude}`
  return endpoint
}
