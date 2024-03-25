import { env } from 'libs/environment'
import { Position } from 'libs/location'

export const getRecommendationEndpoint = ({
  userId,
  position,
  modelEndpoint,
}: {
  userId: number | undefined
  position: Position
  modelEndpoint: string | undefined
}): string | undefined => {
  let queryParams = ''
  if (!userId) return undefined
  if (position === undefined) return undefined
  const endpoint = `${env.RECOMMENDATION_ENDPOINT}/playlist_recommendation/${userId}?token=${env.RECOMMENDATION_TOKEN}`
  if (modelEndpoint) {
    queryParams += `&modelEndpoint=${modelEndpoint}`
  }
  if (position) {
    queryParams += `&longitude=${position.longitude}&latitude=${position.latitude}`
  }
  return endpoint + queryParams
}
