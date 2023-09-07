import * as recommendCore from '@algolia/recommend-core'
import { rest } from 'msw'

import { SearchGroupNameEnumv2 } from 'api/gen'
import * as useAlgoliaSimilarOffers from 'features/offer/api/useAlgoliaSimilarOffers'
import {
  getAlgoliaFrequentlyBoughtTogether,
  getAlgoliaRelatedProducts,
  getApiRecoSimilarOffers,
  getCategories,
  getSimilarOffersEndpoint,
  useSimilarOffers,
} from 'features/offer/api/useSimilarOffers'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { server } from 'tests/server'
import { act, renderHook, waitFor } from 'tests/utils'

const mockUserId = 1234
const mockOfferId = 1
const position = {
  latitude: 6,
  longitude: 22,
}

server.use(
  rest.get(`https://recommmendation-endpoint/similar_offers/${mockOfferId}`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        hits: [],
      })
    )
  })
)

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
  const fetchApiRecoSpy = jest.spyOn(global, 'fetch').mockImplementation()

  it('should call Algolia hook', async () => {
    renderHook(() =>
      useSimilarOffers({
        offerId: mockOfferId,
        categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      })
    )
    await act(async () => {
      expect(algoliaSpy).toHaveBeenCalledTimes(1)
    })
    renderHook(() =>
      useSimilarOffers({
        offerId: mockOfferId,
        position,
        categoryExcluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      })
    )
    await act(async () => {
      expect(algoliaSpy).toHaveBeenCalledTimes(2)
    })
  })

  it('should not call Algolia hook when no offer id provided', () => {
    renderHook(() =>
      useSimilarOffers({
        categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      })
    )
    expect(algoliaSpy).toHaveBeenCalledWith([], true)
  })

  describe('when Algolia Recommend AB Testing deactivated', () => {
    it('should not call similar offers API when no offer provided', () => {
      renderHook(() =>
        useSimilarOffers({
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: false,
        })
      )
      expect(fetchApiRecoSpy).not.toHaveBeenCalled()
    })

    it('should not call similair offers API when offer provided and offer position not loaded', () => {
      renderHook(() =>
        useSimilarOffers({
          offerId: mockOfferId,
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: false,
        })
      )
      expect(fetchApiRecoSpy).not.toHaveBeenCalled()
    })

    it('should call similar offers API when offer id provided and shared offer position loaded', async () => {
      renderHook(() =>
        useSimilarOffers({
          offerId: mockOfferId,
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: false,
          position: { latitude: 10, longitude: 15 },
        })
      )
      await act(async () => {})
      expect(fetchApiRecoSpy).toHaveBeenCalledTimes(1)
    })

    it('should call similar offers API when offer id provided and shared offer position not loaded ', async () => {
      renderHook(() =>
        useSimilarOffers({
          offerId: mockOfferId,
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: false,
          position: { latitude: null, longitude: null },
        })
      )
      await act(async () => {})
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

      it('when no offer provided and offer position not loaded', () => {
        renderHook(() =>
          useSimilarOffers({
            categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            shouldUseAlgoliaRecommend: true,
          })
        )
        expect(getRelatedProductsSpy).not.toHaveBeenCalled()
      })

      it('when offer provided and offer position not loaded', () => {
        renderHook(() =>
          useSimilarOffers({
            offerId: mockOfferId,
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

    it('should call related products API when offer and category included provided and shared offer position loaded', () => {
      renderHook(() =>
        useSimilarOffers({
          offerId: mockOfferId,
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: true,
          position: { latitude: 10, longitude: 15 },
        })
      )
      expect(getRelatedProductsSpy).toHaveBeenCalledTimes(1)
    })

    it('should call related products API when offer and category included provided and not shared offer position loaded', () => {
      renderHook(() =>
        useSimilarOffers({
          offerId: mockOfferId,
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: true,
          position: { latitude: null, longitude: null },
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

    it('with latitude and longitude query params when there are provided', () => {
      const endpoint = getSimilarOffersEndpoint(mockOfferId, undefined, position)
      expect(endpoint).toEqual(
        `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${mockOfferId}?token=${env.RECOMMENDATION_TOKEN}&longitude=${position.longitude}&latitude=${position.latitude}`
      )
    })

    it('without latitude and longitude query params when there are null', () => {
      const endpoint = getSimilarOffersEndpoint(mockOfferId, undefined, {
        latitude: null,
        longitude: null,
      })
      expect(endpoint).toEqual(
        `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${mockOfferId}?token=${env.RECOMMENDATION_TOKEN}`
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

  const params = {
    call_id: 1,
    filtered: true,
    geo_located: false,
    model_endpoint: 'default',
    model_name: 'similar_offers_default_prod',
    model_version: 'similar_offers_clicks_v2_1_prod_v_20230317T173445',
    reco_origin: 'default',
  }

  it('should log sentry when reco similar offers API called with an error', async () => {
    const error = new Error('error')
    fetchApiRecoSpy.mockImplementationOnce(() => Promise.reject(error))

    const apiReco = await getApiRecoSimilarOffers(endpoint)

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
    expect(apiReco).toEqual(undefined)
  })

  it('should return recommendations when reco similar offers API called', async () => {
    const expectedResponse = respondWith({ params, results: ['102280', '102281'] })
    fetchApiRecoSpy.mockReturnValueOnce(Promise.resolve(expectedResponse))

    const apiReco = await getApiRecoSimilarOffers(endpoint)

    expect(apiReco).toEqual({ params, results: ['102280', '102281'] })
  })
})

describe('getCategories', () => {
  describe('should return an empty array ', () => {
    it('when categoryIncluded and categoryExcluded not defined', () => {
      const categories = getCategories()
      expect(categories).toEqual([])
    })

    it('when categoryExcluded defined but not searchGroups', () => {
      const categories = getCategories(undefined, undefined, SearchGroupNameEnumv2.CARTES_JEUNES)
      expect(categories).toEqual([])
    })
  })

  it('should return an array with category of categoryIncluded parameter when defined', () => {
    const categories = getCategories(mockSearchGroups, SearchGroupNameEnumv2.CARTES_JEUNES)
    expect(categories).toEqual([SearchGroupNameEnumv2.CARTES_JEUNES])
  })

  it('should return an array with all categories except none category and categoryExcluded parameter when it is defined', () => {
    const categories = getCategories(
      mockSearchGroups,
      undefined,
      SearchGroupNameEnumv2.CARTES_JEUNES
    )
    expect(categories).toEqual([
      SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
      SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
      SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
      SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
      SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      SearchGroupNameEnumv2.INSTRUMENTS,
      SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      SearchGroupNameEnumv2.LIVRES,
      SearchGroupNameEnumv2.MEDIA_PRESSE,
      SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      SearchGroupNameEnumv2.SPECTACLES,
    ])
  })
})
