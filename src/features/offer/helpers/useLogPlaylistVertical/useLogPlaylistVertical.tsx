import { useCallback } from 'react'

import { PlaylistType } from 'features/offer/enums'
import { analytics } from 'libs/analytics'
import { useFunctionOnce } from 'libs/hooks'
import { RecommendationApiParams } from 'shared/offer/types'

type Props = {
  offerId: number
  nbSameArtistPlaylist: number
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
  logSameArtistPlaylistVerticalScroll: VoidFunction
}

export const useLogPlaylist = ({
  nbSameArtistPlaylist,
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

  const logSameArtistPlaylistVerticalScroll = useFunctionOnce(() => {
    analytics.logPlaylistVerticalScroll({
      fromOfferId,
      offerId,
      playlistType: PlaylistType.SAME_ARTIST_PLAYLIST,
      nbResults: nbSameArtistPlaylist,
    })
  })

  return {
    logPlaylistHorizontalScroll,
    logSameCategoryPlaylistVerticalScroll,
    logOtherCategoriesPlaylistVerticalScroll,
    logSameArtistPlaylistVerticalScroll,
  }
}
