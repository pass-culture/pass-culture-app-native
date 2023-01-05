import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'

export const getRecommendationEndpoint = ({
  userId,
  position,
  modelEndpoint,
}: {
  userId: number | undefined
  position: GeoCoordinates | null
  modelEndpoint: string | undefined
}): string | undefined => {
  let queryParams = ''
  if (!userId) return undefined
  const endpoint = `${env.RECOMMENDATION_ENDPOINT}/playlist_recommendation/${userId}?token=${env.RECOMMENDATION_TOKEN}`
  if (modelEndpoint) {
    queryParams = queryParams + `&modelEndpoint=${modelEndpoint}`
  }
  if (position) {
    queryParams = queryParams + `&longitude=${position.longitude}&latitude=${position.latitude}`
  }
  return endpoint + queryParams
}
