import { RecommendationApiParams } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'
import { useLogPlaylist } from 'features/offer/helpers/useLogPlaylistVertical/useLogPlaylistVertical'
import { analytics } from 'libs/analytics/provider'
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

describe('useLogPlaylist', () => {
  it('should logSameCategoryPlaylistVerticalScroll correctly', () => {
    const { result } = renderHook(() =>
      useLogPlaylist({
        offerId: 1,
        nbSameCategorySimilarOffers: 5,
        nbOtherCategoriesSimilarOffers: 0,
        apiRecoParamsSameCategory: apiRecoParams,
        fromOfferId: 2,
      })
    )

    result.current.logSameCategoryPlaylistVerticalScroll()

    expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
      ...apiRecoParams,
      fromOfferId: 2,
      offerId: 1,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      nbResults: 5,
    })
  })

  it('should log only once logSameCategoryPlaylistVerticalScroll', () => {
    const { result } = renderHook(() =>
      useLogPlaylist({
        offerId: 1,
        nbSameCategorySimilarOffers: 5,
        nbOtherCategoriesSimilarOffers: 0,
        apiRecoParamsSameCategory: apiRecoParams,
        fromOfferId: 2,
      })
    )

    result.current.logSameCategoryPlaylistVerticalScroll()

    expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)

    result.current.logSameCategoryPlaylistVerticalScroll()

    expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
  })

  it('should logOtherCategoriesPlaylistVerticalScroll correctly', () => {
    const { result } = renderHook(() =>
      useLogPlaylist({
        offerId: 1,
        nbSameCategorySimilarOffers: 0,
        nbOtherCategoriesSimilarOffers: 5,
        apiRecoParamsOtherCategories: apiRecoParams,
        fromOfferId: 2,
      })
    )

    result.current.logOtherCategoriesPlaylistVerticalScroll()

    expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
      ...apiRecoParams,
      fromOfferId: 2,
      offerId: 1,
      playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      nbResults: 5,
    })
  })

  it('should log only once logOtherCategoriesPlaylistVerticalScroll', () => {
    const { result } = renderHook(() =>
      useLogPlaylist({
        offerId: 1,
        nbSameCategorySimilarOffers: 0,
        nbOtherCategoriesSimilarOffers: 5,
        apiRecoParamsOtherCategories: apiRecoParams,
        fromOfferId: 2,
      })
    )

    result.current.logOtherCategoriesPlaylistVerticalScroll()

    expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)

    result.current.logOtherCategoriesPlaylistVerticalScroll()

    expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
  })

  it('should logPlaylistHorizontalScroll correctly', () => {
    const { result, rerender } = renderHook(
      ({ fromOfferId }: { fromOfferId: number }) =>
        useLogPlaylist({
          offerId: 1,
          nbOtherCategoriesSimilarOffers: 0,
          nbSameCategorySimilarOffers: 0,
          fromOfferId,
        }),
      {
        initialProps: { fromOfferId: 2 },
      }
    )

    result.current.logPlaylistHorizontalScroll()

    expect(analytics.logPlaylistHorizontalScroll).toHaveBeenCalledWith(2)

    // Testing with a different fromOfferId
    rerender({ fromOfferId: 3 })

    result.current.logPlaylistHorizontalScroll()

    expect(analytics.logPlaylistHorizontalScroll).toHaveBeenCalledWith(3)
  })
})
