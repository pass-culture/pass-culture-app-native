import { useCallback } from 'react'

import { RecommendationApiParams } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'
import { analytics } from 'libs/analytics/provider'
import { useFunctionOnce } from 'libs/hooks'

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

  const logConsultWholeOffer = useFunctionOnce(() => {
    analytics.logConsultWholeOffer(offerId)
  })

  const logPlaylistHorizontalScroll = useCallback(() => {
    analytics.logPlaylistHorizontalScroll(fromOfferId)
  }, [fromOfferId])

  return {
    logSameCategoryPlaylistVerticalScroll,
    logOtherCategoriesPlaylistVerticalScroll,
    logSameArtistPlaylistVerticalScroll,
    logConsultWholeOffer,
    logPlaylistHorizontalScroll,
  }
}
