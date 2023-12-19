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

type UseOfferAnalyticsType = {
  logSameCategoryPlaylistVerticalScroll: VoidFunction
  logOtherCategoriesPlaylistVerticalScroll: VoidFunction
  logSameArtistPlaylistVerticalScroll: VoidFunction
  logConsultWholeOffer: VoidFunction
  logPlaylistHorizontalScroll: VoidFunction
}

export const useOfferAnalytics = ({
  offerId,
  nbSameArtistPlaylist,
  apiRecoParamsSameCategory,
  nbSameCategorySimilarOffers,
  apiRecoParamsOtherCategories,
  nbOtherCategoriesSimilarOffers,
  fromOfferId,
}: Props): UseOfferAnalyticsType => {
  const logSameCategoryPlaylistVerticalScroll = useFunctionOnce(() => {
    return analytics.logPlaylistVerticalScroll({
      ...apiRecoParamsSameCategory,
      fromOfferId,
      offerId,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      nbResults: nbSameCategorySimilarOffers,
    })
  })

  const logOtherCategoriesPlaylistVerticalScroll = useFunctionOnce(() => {
    return analytics.logPlaylistVerticalScroll({
      ...apiRecoParamsOtherCategories,
      fromOfferId,
      offerId,
      playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      nbResults: nbOtherCategoriesSimilarOffers,
    })
  })

  const logSameArtistPlaylistVerticalScroll = useFunctionOnce(() => {
    return analytics.logPlaylistVerticalScroll({
      fromOfferId,
      offerId,
      playlistType: PlaylistType.SAME_ARTIST_PLAYLIST,
      nbResults: nbSameArtistPlaylist,
    })
  })

  const logConsultWholeOffer = useFunctionOnce(() => {
    analytics.logConsultWholeOffer(offerId)
  })

  const logPlaylistHorizontalScroll = useCallback(() => {
    return analytics.logPlaylistHorizontalScroll(fromOfferId)
  }, [fromOfferId])

  return {
    logSameCategoryPlaylistVerticalScroll,
    logOtherCategoriesPlaylistVerticalScroll,
    logSameArtistPlaylistVerticalScroll,
    logConsultWholeOffer,
    logPlaylistHorizontalScroll,
  }
}
