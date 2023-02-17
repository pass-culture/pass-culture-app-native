import * as getFrequentlyBoughtTogether from '@algolia/recommend-core'
import * as getRelatedProducts from '@algolia/recommend-core'

import { SearchGroupNameEnumv2 } from 'api/gen'
import * as useAlgoliaSimilarOffers from 'features/offer/api/useAlgoliaSimilarOffers'
import { getSimilarOffersEndpoint, useSimilarOffers } from 'features/offer/api/useSimilarOffers'
import { env } from 'libs/environment'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

const mockUserId = 1234
const mockOfferId = 1
const position = {
  latitude: 6,
  longitude: 22,
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
    .spyOn(getFrequentlyBoughtTogether, 'getFrequentlyBoughtTogether')
    .mockImplementation()
  const getRelatedProductsSpy = jest
    .spyOn(getRelatedProducts, 'getRelatedProducts')
    .mockImplementation()
  const fetchApiRecoSpy = jest.spyOn(global, 'fetch')

  it('should call Algolia hook', () => {
    renderHook(() =>
      useSimilarOffers({
        offerId: mockOfferId,
        categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
        categoryExcluded: undefined,
      })
    )
    expect(algoliaSpy).toHaveBeenCalledTimes(1)
    renderHook(() =>
      useSimilarOffers({
        offerId: mockOfferId,
        position,
        categoryIncluded: undefined,
        categoryExcluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      })
    )
    expect(algoliaSpy).toHaveBeenCalledTimes(2)
  })

  it('should not call Algolia hook when no offer id provided', () => {
    renderHook(() =>
      useSimilarOffers({
        categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
        categoryExcluded: undefined,
      })
    )
    expect(algoliaSpy).toHaveBeenCalledWith([])
  })

  describe('when Algolia Recommend AB Testing desactivated', () => {
    it('should not call similar offers API when no offer provided', () => {
      renderHook(() =>
        useSimilarOffers({
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          categoryExcluded: undefined,
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
          categoryExcluded: undefined,
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
            categoryExcluded: undefined,
            shouldUseAlgoliaRecommend: true,
          })
        )
        expect(getRelatedProductsSpy).not.toHaveBeenCalled()
      })

      it('when offer and category excluded provided', () => {
        renderHook(() =>
          useSimilarOffers({
            offerId: mockOfferId,
            categoryIncluded: undefined,
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
            categoryExcluded: undefined,
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
            categoryExcluded: undefined,
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
          categoryExcluded: undefined,
          shouldUseAlgoliaRecommend: true,
        })
      )
      expect(getRelatedProductsSpy).toHaveBeenCalledTimes(1)
    })

    it('should call frequently bought together API when offer and category excluded provided', () => {
      renderHook(() =>
        useSimilarOffers({
          offerId: mockOfferId,
          categoryIncluded: undefined,
          categoryExcluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          shouldUseAlgoliaRecommend: true,
        })
      )
      expect(getFrequentlyBoughtTogetherSpy).toHaveBeenCalledTimes(1)
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
