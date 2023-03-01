import * as recommendCore from '@algolia/recommend-core'

import { SearchGroupNameEnumv2 } from 'api/gen'
import * as useAlgoliaSimilarOffers from 'features/offer/api/useAlgoliaSimilarOffers'
import {
  getAlgoliaFrequentlyBoughtTogether,
  getAlgoliaRelatedProducts,
  getApiRecoSimilarOffers,
  getSimilarOffersEndpoint,
  useSimilarOffers,
} from 'features/offer/api/useSimilarOffers'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { renderHook, waitFor } from 'tests/utils'

const mockUserId = 1234
const mockOfferId = 1
const position = {
  latitude: 6,
  longitude: 22,
}

const respondWith = async (
  body: unknown,
  status = 200,
  statusText?: string,
  headers?: HeadersInit
): Promise<Response> => {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    status,
    statusText,
  })
}

jest.mock('features/auth/context/AuthContext')

const mockSearchGroups = placeholderData.searchGroups
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      searchGroups: mockSearchGroups,
    },
  }),
}))

describe('useSimilarOffers', () => {
  const algoliaSpy = jest
    .spyOn(useAlgoliaSimilarOffers, 'useAlgoliaSimilarOffers')
    .mockImplementation()
  const getFrequentlyBoughtTogetherSpy = jest
    .spyOn(recommendCore, 'getFrequentlyBoughtTogether')
    .mockImplementation()
  const getRelatedProductsSpy = jest.spyOn(recommendCore, 'getRelatedProducts').mockImplementation()
  const fetchApiRecoSpy = jest.spyOn(global, 'fetch')

  it('should call Algolia hook', () => {
    renderHook(() =>
      useSimilarOffers({
        offerId: mockOfferId,
        categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      })
    )
    expect(algoliaSpy).toHaveBeenCalledTimes(1)
    renderHook(() =>
      useSimilarOffers({
        offerId: mockOfferId,
        position,
        categoryExcluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      })
    )
    expect(algoliaSpy).toHaveBeenCalledTimes(2)
  })

  it('should not call Algolia hook when no offer id provided', () => {
    renderHook(() =>
      useSimilarOffers({
        categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      })
    )
    expect(algoliaSpy).toHaveBeenCalledWith([])
  })

  describe('when Algolia Recommend AB Testing desactivated', () => {
    it('should not call similar offers API when no offer provided', () => {
      renderHook(() =>
        useSimilarOffers({
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: false,
        })
      )
      expect(fetchApiRecoSpy).not.toHaveBeenCalled()
    })

    it('should call similar offers API when offer id provided', () => {
      renderHook(() =>
        useSimilarOffers({
          offerId: mockOfferId,
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: false,
        })
      )
      expect(fetchApiRecoSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('when Algolia Recommend AB Testing activated', () => {
    describe('should not call related products API', () => {
      it('when no offer provided', () => {
        renderHook(() =>
          useSimilarOffers({
            categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            shouldUseAlgoliaRecommend: true,
          })
        )
        expect(getRelatedProductsSpy).not.toHaveBeenCalled()
      })

      it('when offer and category excluded provided', () => {
        renderHook(() =>
          useSimilarOffers({
            offerId: mockOfferId,
            categoryExcluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            shouldUseAlgoliaRecommend: true,
          })
        )
        expect(getRelatedProductsSpy).not.toHaveBeenCalled()
      })
    })

    describe('should not call frequently bought together API', () => {
      it(' when no offer provided', () => {
        renderHook(() =>
          useSimilarOffers({
            categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            shouldUseAlgoliaRecommend: true,
          })
        )
        expect(getFrequentlyBoughtTogetherSpy).not.toHaveBeenCalled()
      })

      it('when offer and category included provided', () => {
        renderHook(() =>
          useSimilarOffers({
            offerId: mockOfferId,
            categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            shouldUseAlgoliaRecommend: true,
          })
        )
        expect(getFrequentlyBoughtTogetherSpy).not.toHaveBeenCalled()
      })
    })

    it('should call related products API when offer and category included provided', () => {
      renderHook(() =>
        useSimilarOffers({
          offerId: mockOfferId,
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: true,
        })
      )
      expect(getRelatedProductsSpy).toHaveBeenCalledTimes(1)
    })

    it('should call frequently bought together API when offer and category excluded provided', () => {
      renderHook(() =>
        useSimilarOffers({
          offerId: mockOfferId,
          categoryExcluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: true,
        })
      )
      expect(getFrequentlyBoughtTogetherSpy).toHaveBeenCalledTimes(1)
    })

    it('should log sentry when frequently bought together API called with an error', async () => {
      const error = new Error('error')
      getFrequentlyBoughtTogetherSpy.mockImplementationOnce(() => Promise.reject(error))
      renderHook(() =>
        useSimilarOffers({
          offerId: mockOfferId,
          categoryExcluded: SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
          shouldUseAlgoliaRecommend: true,
        })
      )
      await waitFor(() => {
        expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
      })
    })
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
    it('with offer id, user id, latitude, longitude and categories query params when they are not provided', () => {
      const endpoint = getSimilarOffersEndpoint(mockOfferId, undefined, undefined, undefined)
      expect(endpoint).toEqual(
        `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${mockOfferId}?token=${env.RECOMMENDATION_TOKEN}`
      )
    })

    it('when offer id not passed in parameter', () => {
      const endpoint = getSimilarOffersEndpoint(undefined, undefined, undefined, undefined)
      expect(endpoint).toEqual(undefined)
    })
  })
})

describe('getAlgoliaRelatedProducts', () => {
  const getRelatedProductsSpy = jest.spyOn(recommendCore, 'getRelatedProducts').mockImplementation()

  it('should log sentry when related products API called with an error', async () => {
    const error = new Error('error')
    getRelatedProductsSpy.mockImplementationOnce(() => Promise.reject(error))

    const relatedProducts = await getAlgoliaRelatedProducts(String(mockOfferId), {}, {})

    expect(relatedProducts).toEqual([])
  })

  it('should return recommendations when related products API called', async () => {
    const recommendations = [{ objectID: '102280' }, { objectID: '102281' }]
    getRelatedProductsSpy.mockReturnValueOnce(Promise.resolve({ recommendations }))

    const relatedProducts = await getAlgoliaRelatedProducts(String(mockOfferId), {}, {})

    expect(relatedProducts).toEqual(['102280', '102281'])
  })
})

describe('getAlgoliaFrequentlyBoughtTogether', () => {
  const getFrequentlyBoughtTogetherSpy = jest
    .spyOn(recommendCore, 'getFrequentlyBoughtTogether')
    .mockImplementation()

  it('should log sentry when frequently bought together API called with an error', async () => {
    const error = new Error('error')
    getFrequentlyBoughtTogetherSpy.mockImplementationOnce(() => Promise.reject(error))

    const frequentlyBoughtTogether = await getAlgoliaFrequentlyBoughtTogether(
      String(mockOfferId),
      {}
    )

    expect(frequentlyBoughtTogether).toEqual([])
  })

  it('should return recommendations when frequently bought together API called', async () => {
    const recommendations = [{ objectID: '102280' }, { objectID: '102281' }]
    getFrequentlyBoughtTogetherSpy.mockReturnValueOnce(Promise.resolve({ recommendations }))

    const frequentlyBoughtTogether = await getAlgoliaFrequentlyBoughtTogether(
      String(mockOfferId),
      {}
    )

    expect(frequentlyBoughtTogether).toEqual(['102280', '102281'])
  })
})

describe('getApiRecoSimilarOffers', () => {
  const fetchApiRecoSpy = jest.spyOn(global, 'fetch')
  const endpoint = getSimilarOffersEndpoint(mockOfferId, mockUserId) || ''

  it('should log sentry when reco similar offers API called with an error', async () => {
    const error = new Error('error')
    fetchApiRecoSpy.mockImplementationOnce(() => Promise.reject(error))

    const apiReco = await getApiRecoSimilarOffers(endpoint)

    expect(apiReco).toEqual(undefined)
  })

  it('should return recommendations when reco similar offers API called', async () => {
    const expectedResponse = respondWith({ results: ['102280', '102281'] })
    fetchApiRecoSpy.mockReturnValueOnce(Promise.resolve(expectedResponse))

    const apiReco = await getApiRecoSimilarOffers(endpoint)

    expect(apiReco).toEqual(['102280', '102281'])
  })
})
