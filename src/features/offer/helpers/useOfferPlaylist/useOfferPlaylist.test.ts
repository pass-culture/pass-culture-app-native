import {
  CategoryIdEnum,
  RecommendationApiParams,
  SearchGroupNameEnumv2,
  SimilarOffersRequestQuery,
} from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import * as useSimilarOffersAPI from 'features/offer/queries/useSimilarOffersQuery'
import { moreHitsForSimilarOffersPlaylist } from 'libs/algolia/fixtures/algoliaFixtures'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { searchGroupsDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { renderHook } from 'tests/utils'

const apiRecoParams: RecommendationApiParams = {
  callId: '1',
  filtered: true,
  geoLocated: false,
  modelEndpoint: 'default',
  modelName: 'similar_offers_default_prod',
  modelVersion: 'similar_offers_clicks_v2_1_prod_v_20230317T173445',
  recoOrigin: 'default',
}

const offer = offerResponseSnap
const offerSearchGroup = SearchGroupNameEnumv2.CINEMA
const searchGroupList = searchGroupsDataTest

const useSimilarOffersSpy = jest
  .spyOn(useSimilarOffersAPI, 'useSimilarOffersQuery')
  .mockImplementation()
  .mockReturnValue({ similarOffers: moreHitsForSimilarOffersPlaylist, apiRecoParams })

jest.mock('libs/firebase/analytics/analytics')

describe('useOfferPlaylist', () => {
  beforeEach(() => {
    useLocationV2.setState(defaultLocationState)
    locationActions.setGeolocPosition({ latitude: 90.4773245, longitude: 90.4773245 })
    locationActions.setLocationMode(LocationMode.AROUND_ME)
  })

  describe('When offer is defined', () => {
    it('should return same category similar offers playlist', () => {
      const { result } = renderHook(() =>
        useOfferPlaylist({
          offer,
          offerCategory: CategoryIdEnum.CINEMA,
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
          offerCategory: CategoryIdEnum.CINEMA,
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
          offerCategory: CategoryIdEnum.CINEMA,
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
          offerCategory: CategoryIdEnum.CINEMA,
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
          offerCategory: CategoryIdEnum.CINEMA,
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

    it('should fetch books same category playlist with graph retrieval model for book offers', async () => {
      renderHook(() =>
        useOfferPlaylist({
          offer,
          offerCategory: CategoryIdEnum.LIVRE,
          offerSearchGroup: SearchGroupNameEnumv2.LIVRES,
          searchGroupList,
        })
      )

      expect(useSimilarOffersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          categoryIncluded: SearchGroupNameEnumv2.LIVRES,
          offerId: offer.id,
          retrievalModel: SimilarOffersRequestQuery.RetrievalModelEnum.Graph,
          shouldFetch: true,
        })
      )
      expect(useSimilarOffersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          categoryExcluded: SearchGroupNameEnumv2.LIVRES,
          offerId: offer.id,
          shouldFetch: false,
        })
      )
    })
  })
})
