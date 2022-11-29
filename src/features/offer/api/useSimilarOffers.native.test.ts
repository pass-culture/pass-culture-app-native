import * as useAlgoliaSimilarOffers from 'features/offer/api/useAlgoliaSimilarOffers'
import { getSimilarOffersEndpoint, useSimilarOffers } from 'features/offer/api/useSimilarOffers'
import { env } from 'libs/environment'
import { renderHook } from 'tests/utils'

const mockUserId = 1234
const mockOfferId = 1
const position = {
  latitude: 6,
  longitude: 22,
}

jest.mock('features/auth/AuthContext')

describe('useSimilarOffers', () => {
  const algoliaSpy = jest
    .spyOn(useAlgoliaSimilarOffers, 'useAlgoliaSimilarOffers')
    .mockImplementation()

  it('should call algolia hook', () => {
    renderHook(() => useSimilarOffers(mockOfferId))
    expect(algoliaSpy).toHaveBeenCalledTimes(1)
    renderHook(() => useSimilarOffers(mockOfferId, position))
    expect(algoliaSpy).toHaveBeenCalledTimes(2)
  })
})

describe('getSimilarOffersEndpoint', () => {
  it('should return endpoint with user id query param when user id is provided', () => {
    const endpoint = getSimilarOffersEndpoint(mockOfferId, mockUserId)
    expect(endpoint).toEqual(
      `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${mockOfferId}?token=${env.RECOMMENDATION_TOKEN}&userId=${mockUserId}`
    )
  })

  it('should return endpoint with latitude and longitude query params when position is provided', () => {
    const endpoint = getSimilarOffersEndpoint(mockOfferId, undefined, position)
    expect(endpoint).toEqual(
      `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${mockOfferId}?token=${env.RECOMMENDATION_TOKEN}&longitude=${position.longitude}&latitude=${position.latitude}`
    )
  })
})
