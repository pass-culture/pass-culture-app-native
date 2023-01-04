import { getRecommendationEndpoint } from 'features/home/api/helpers/getRecommendationEndpoint'
import { env } from 'libs/environment'

const mockUserId = 1234
const position = {
  latitude: 6,
  longitude: 22,
}

describe('getRecommendationEndpoint', () => {
  it('should return undefined when no user id is provided', () => {
    const endpoint = getRecommendationEndpoint(undefined, null)
    expect(endpoint).toBeUndefined()
  })
  it('should return endpoint with latitude and longitude query params when position is provided', () => {
    const endpoint = getRecommendationEndpoint(mockUserId, position)
    expect(endpoint).toEqual(
      `${env.RECOMMENDATION_ENDPOINT}/playlist_recommendation/${mockUserId}?token=${env.RECOMMENDATION_TOKEN}&longitude=${position.longitude}&latitude=${position.latitude}`
    )
  })
})
