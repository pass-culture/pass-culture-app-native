import { useCallback } from 'react'

import { RecommendationApiParams } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'
import { analytics } from 'libs/analytics/provider'
import { useFunctionOnce } from 'libs/hooks'

type Props = {
  offerId: number
  nbSameCategorySimilarOffers: number
  nbBooksSameCategorySimilarOffers?: number
  nbOtherCategoriesSimilarOffers: number
  apiRecoParamsSameCategory?: RecommendationApiParams
  apiRecoParamsBooksSameCategory?: RecommendationApiParams
  apiRecoParamsOtherCategories?: RecommendationApiParams
  fromOfferId?: number
}

type UseLogPlaylistType = {
  logPlaylistHorizontalScroll: VoidFunction
  logSameCategoryPlaylistVerticalScroll: VoidFunction
  logBooksSameCategoryPlaylistVerticalScroll: VoidFunction
  logOtherCategoriesPlaylistVerticalScroll: VoidFunction
}

export const useLogPlaylist = ({
  apiRecoParamsSameCategory,
  nbSameCategorySimilarOffers,
  apiRecoParamsBooksSameCategory,
  nbBooksSameCategorySimilarOffers = 0,
  apiRecoParamsOtherCategories,
  nbOtherCategoriesSimilarOffers,
  offerId,
  fromOfferId,
}: Props): UseLogPlaylistType => {
  const logPlaylistHorizontalScroll = useCallback(() => {
    void analytics.logPlaylistHorizontalScroll(fromOfferId)
  }, [fromOfferId])

  const logSameCategoryPlaylistVerticalScroll = useFunctionOnce(() => {
    void analytics.logPlaylistVerticalScroll({
      ...apiRecoParamsSameCategory,
      fromOfferId,
      offerId,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      nbResults: nbSameCategorySimilarOffers,
    })
  })

  const logOtherCategoriesPlaylistVerticalScroll = useFunctionOnce(() => {
    void analytics.logPlaylistVerticalScroll({
      ...apiRecoParamsOtherCategories,
      fromOfferId,
      offerId,
      playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      nbResults: nbOtherCategoriesSimilarOffers,
    })
  })

  const logBooksSameCategoryPlaylistVerticalScroll = useFunctionOnce(() => {
    void analytics.logPlaylistVerticalScroll({
      ...apiRecoParamsBooksSameCategory,
      fromOfferId,
      offerId,
      playlistType: PlaylistType.BOOKS_SAME_CATEGORY_SIMILAR_OFFERS,
      nbResults: nbBooksSameCategorySimilarOffers,
    })
  })

  return {
    logPlaylistHorizontalScroll,
    logSameCategoryPlaylistVerticalScroll,
    logBooksSameCategoryPlaylistVerticalScroll,
    logOtherCategoriesPlaylistVerticalScroll,
  }
}
