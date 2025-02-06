import { useCallback } from 'react'

import { RecommendationApiParams } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'
import { analytics } from 'libs/analytics/provider'
import { useFunctionOnce } from 'libs/hooks'

type Props = {
  offerId: number
  nbSameCategorySimilarOffers: number
  nbOtherCategoriesSimilarOffers: number
  apiRecoParamsSameCategory?: RecommendationApiParams
  apiRecoParamsOtherCategories?: RecommendationApiParams
  fromOfferId?: number
}

type UseLogPlaylistType = {
  logPlaylistHorizontalScroll: VoidFunction
  logSameCategoryPlaylistVerticalScroll: VoidFunction
  logOtherCategoriesPlaylistVerticalScroll: VoidFunction
}

export const useLogPlaylist = ({
  apiRecoParamsSameCategory,
  nbSameCategorySimilarOffers,
  apiRecoParamsOtherCategories,
  nbOtherCategoriesSimilarOffers,
  offerId,
  fromOfferId,
}: Props): UseLogPlaylistType => {
  const logPlaylistHorizontalScroll = useCallback(() => {
    analytics.logPlaylistHorizontalScroll(fromOfferId)
  }, [fromOfferId])

  const logSameCategoryPlaylistVerticalScroll = useFunctionOnce(() => {
    analytics.logPlaylistVerticalScroll({
      ...apiRecoParamsSameCategory,
      fromOfferId,
      offerId,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      nbResults: nbSameCategorySimilarOffers,
    })
  })

  const logOtherCategoriesPlaylistVerticalScroll = useFunctionOnce(() => {
    analytics.logPlaylistVerticalScroll({
      ...apiRecoParamsOtherCategories,
      fromOfferId,
      offerId,
      playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      nbResults: nbOtherCategoriesSimilarOffers,
    })
  })

  return {
    logPlaylistHorizontalScroll,
    logSameCategoryPlaylistVerticalScroll,
    logOtherCategoriesPlaylistVerticalScroll,
  }
}
