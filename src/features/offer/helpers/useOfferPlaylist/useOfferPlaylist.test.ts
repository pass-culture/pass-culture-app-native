import { RecommendationApiParams, SearchGroupNameEnumv2 } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import * as useSimilarOffersAPI from 'features/offer/queries/useSimilarOffersQuery'
import { moreHitsForSimilarOffersPlaylist } from 'libs/algolia/fixtures/algoliaFixtures'
import { Position } from 'libs/location'
import { searchGroupsDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { renderHook } from 'tests/utils'

const apiRecoParams: RecommendationApiParams = {
  call_id: '1',
  filtered: true,
  geo_located: false,
  model_endpoint: 'default',
  model_name: 'similar_offers_default_prod',
  model_version: 'similar_offers_clicks_v2_1_prod_v_20230317T173445',
  reco_origin: 'default',
}

const offer = offerResponseSnap
const offerSearchGroup = SearchGroupNameEnumv2.CINEMA
const searchGroupList = searchGroupsDataTest

const useSimilarOffersSpy = jest
  .spyOn(useSimilarOffersAPI, 'useSimilarOffersQuery')
  .mockImplementation()
  .mockReturnValue({ similarOffers: moreHitsForSimilarOffersPlaylist, apiRecoParams })

const mockPosition: Position = { latitude: 90.4773245, longitude: 90.4773245 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockPosition,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('useOfferPlaylist', () => {
  describe('When offer is defined', () => {
    it('should return same category similar offers playlist', () => {
      const { result } = renderHook(() =>
        useOfferPlaylist({
          offer,
          offerSearchGroup,
          searchGroupList,
        })
      )

      expect(result.current?.sameCategorySimilarOffers).toEqual(moreHitsForSimilarOffersPlaylist)
    })

    it('should return api reco params of same category similar offers query', () => {
      const { result } = renderHook(() =>
        useOfferPlaylist({
          offer,
          offerSearchGroup,
          searchGroupList,
        })
      )

      expect(result.current?.apiRecoParamsSameCategory).toEqual(apiRecoParams)
    })

    it('should return other categories similar offers playlist', () => {
      const { result } = renderHook(() =>
        useOfferPlaylist({
          offer,
          offerSearchGroup,
          searchGroupList,
        })
      )

      expect(result.current?.otherCategoriesSimilarOffers).toEqual(moreHitsForSimilarOffersPlaylist)
    })

    it('should return api reco params of other categories similar offers query', () => {
      const { result } = renderHook(() =>
        useOfferPlaylist({
          offer,
          offerSearchGroup,
          searchGroupList,
        })
      )

      expect(result.current?.apiRecoParamsOtherCategories).toEqual(apiRecoParams)
    })

    it('should call api reco with user position', async () => {
      renderHook(() =>
        useOfferPlaylist({
          offer,
          offerSearchGroup,
          searchGroupList,
        })
      )

      expect(useSimilarOffersSpy).toHaveBeenCalledWith(
        // allows you to check that the call was made at least once with these parameters
        expect.objectContaining({
          categoryIncluded: SearchGroupNameEnumv2.CINEMA,
          offerId: offer.id,
          position: { longitude: 90.477, latitude: 90.477 },
        })
      )
      expect(useSimilarOffersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          categoryExcluded: SearchGroupNameEnumv2.CINEMA,
          offerId: offer.id,
          position: { longitude: 90.477, latitude: 90.477 },
        })
      )
    })
  })
})
