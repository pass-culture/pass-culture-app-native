import { OfferExtraData, RecommendationApiParams, SearchGroupNameEnumv2 } from 'api/gen'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import * as useSameArtistPlaylist from 'features/offer/helpers/useSameArtistPlaylist/useSameArtistPlaylist'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/fixtures/algoliaFixtures'
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

const extraData: OfferExtraData = {
  author: 'Eiichiro Oda',
  ean: '9782723492607',
}

const useSimilarOffersSpy = jest
  .spyOn(useSimilarOffers, 'useSimilarOffers')
  .mockImplementation()
  .mockReturnValue({ similarOffers: moreHitsForSimilarOffersPlaylist, apiRecoParams })

const useSameArtistPlaylistSpy = jest
  .spyOn(useSameArtistPlaylist, 'useSameArtistPlaylist')
  .mockImplementation()
  .mockReturnValue({
    sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
  })

const mockPosition: Position = { latitude: 90.4773245, longitude: 90.4773245 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockPosition,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('useOfferPlaylist', () => {
  describe('When offer is defined', () => {
    it('should return same artist playlist', () => {
      const { result } = renderHook(() =>
        useOfferPlaylist({
          offer,
          offerSearchGroup,
          searchGroupList,
        })
      )

      expect(result.current?.sameArtistPlaylist).toEqual(mockedAlgoliaOffersWithSameArtistResponse)
    })

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

    it('should handle provided artist', async () => {
      renderHook(() =>
        useOfferPlaylist({
          offer: { ...offer, extraData },
          offerSearchGroup,
          searchGroupList,
        })
      )

      expect(useSameArtistPlaylistSpy).toHaveBeenNthCalledWith(1, {
        artists: 'Eiichiro Oda',
        searchGroupName: SearchGroupNameEnumv2.CINEMA,
      })
    })

    it('should handle missing artist and EAN', async () => {
      renderHook(() =>
        useOfferPlaylist({
          offer,
          offerSearchGroup,
          searchGroupList,
        })
      )

      expect(useSameArtistPlaylistSpy).toHaveBeenNthCalledWith(1, {
        artists: undefined,
        ean: undefined,
        searchGroupName: SearchGroupNameEnumv2.CINEMA,
      })
    })
  })
})
