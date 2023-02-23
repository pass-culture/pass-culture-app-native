import { SearchGroupNameEnumv2 } from 'api/gen'
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

jest.mock('features/auth/context/AuthContext')

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
  describe('should return endpoint', () => {
    it('with user id query param when it is provided', () => {
      const endpoint = getSimilarOffersEndpoint(mockOfferId, mockUserId)
      expect(endpoint).toEqual(
        `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${mockOfferId}?token=${env.RECOMMENDATION_TOKEN}&userId=${mockUserId}`
      )
    })

    it('with latitude and longitude query params when they are provided', () => {
      const endpoint = getSimilarOffersEndpoint(mockOfferId, undefined, position)
      expect(endpoint).toEqual(
        `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${mockOfferId}?token=${env.RECOMMENDATION_TOKEN}&longitude=${position.longitude}&latitude=${position.latitude}`
      )
    })

    it('with one value in categories array query param when it is provided', () => {
      const endpoint = getSimilarOffersEndpoint(mockOfferId, undefined, undefined, [
        SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      ])
      expect(endpoint).toEqual(
        `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${mockOfferId}?token=${env.RECOMMENDATION_TOKEN}&categories=${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}`
      )
    })

    it('with several values in categories array query param when it is provided', () => {
      const endpoint = getSimilarOffersEndpoint(mockOfferId, undefined, undefined, [
        SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
        SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      ])
      expect(endpoint).toEqual(
        `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${mockOfferId}?token=${env.RECOMMENDATION_TOKEN}&categories=${SearchGroupNameEnumv2.FILMS_SERIES_CINEMA}&categories=${SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}`
      )
    })
  })

  describe('should not return endpoint', () => {
    it('with user id, latitude, longitude and categories query params when they are not provided', () => {
      const endpoint = getSimilarOffersEndpoint(mockOfferId, undefined, undefined, undefined)
      expect(endpoint).toEqual(
        `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${mockOfferId}?token=${env.RECOMMENDATION_TOKEN}`
      )
    })
  })
})
