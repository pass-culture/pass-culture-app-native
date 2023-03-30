import { getRecommendationEndpoint } from 'features/home/api/helpers/getRecommendationEndpoint'
import { env } from 'libs/environment'

const mockUserId = 1234
const position = {
  latitude: 6,
  longitude: 22,
}

describe('getRecommendationEndpoint', () => {
  it('should return undefined when no user id is provided', () => {
    const endpoint = getRecommendationEndpoint({
      userId: undefined,
      position: null,
      modelEndpoint: undefined,
    })
    expect(endpoint).toBeUndefined()
  })
  it('should return endpoint with latitude and longitude query params when position is provided', () => {
    const modelEndpoint = undefined
    const endpoint = getRecommendationEndpoint({ userId: mockUserId, position, modelEndpoint })
    expect(endpoint).toEqual(
      `${env.RECOMMENDATION_ENDPOINT}/playlist_recommendation/${mockUserId}?token=${env.RECOMMENDATION_TOKEN}&longitude=${position.longitude}&latitude=${position.latitude}`
    )
  })
  it('should return endpoint with endpoint query params when a endpoint is provided', () => {
    const modelEndpoint = 'endpoint'
    const endpoint = getRecommendationEndpoint({ userId: mockUserId, position, modelEndpoint })
    expect(endpoint).toEqual(
      `${env.RECOMMENDATION_ENDPOINT}/playlist_recommendation/${mockUserId}?token=${env.RECOMMENDATION_TOKEN}&modelEndpoint=${modelEndpoint}&longitude=${position.longitude}&latitude=${position.latitude}`
    )
  })
})
