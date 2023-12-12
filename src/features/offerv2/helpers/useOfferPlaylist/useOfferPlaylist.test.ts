import { OfferExtraData, SearchGroupNameEnumv2 } from 'api/gen'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import * as useSameArtistPlaylist from 'features/offer/components/OfferPlaylist/hook/useSameArtistPlaylist'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { useOfferPlaylist } from 'features/offerv2/helpers/useOfferPlaylist/useOfferPlaylist'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { RecommendationApiParams } from 'shared/offer/types'
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
const offerSearchGroup = SearchGroupNameEnumv2.FILMS_SERIES_CINEMA
const searchGroupList = placeholderData.searchGroups

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
    refetch: jest.fn(),
  })

jest.mock('libs/location')

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

    it('should return refetch same artist playlist function', () => {
      const { result } = renderHook(() =>
        useOfferPlaylist({
          offer,
          offerSearchGroup,
          searchGroupList,
        })
      )

      expect(result.current?.refetchSameArtistPlaylist).toEqual(expect.any(Function))
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
          categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          offerId: offer.id,
          position: { longitude: 90.477, latitude: 90.477 },
        })
      )
      expect(useSimilarOffersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          categoryExcluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          offerId: offer.id,
          position: { longitude: 90.477, latitude: 90.477 },
        })
      )
    })

    it('should handle provided artist and EAN', async () => {
      renderHook(() =>
        useOfferPlaylist({
          offer: { ...offer, extraData },
          offerSearchGroup,
          searchGroupList,
        })
      )

      expect(useSameArtistPlaylistSpy).toHaveBeenNthCalledWith(1, {
        artists: 'Eiichiro Oda',
        ean: '9782723492607',
        searchGroupName: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
        venueLocation: { latitude: 20, longitude: 2 },
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
        searchGroupName: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
        venueLocation: { latitude: 20, longitude: 2 },
      })
    })
  })
})
