import { useNavigation, useRoute } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { ViewToken } from 'react-native'

import { OfferResponse, RecommendationApiParams, SearchGroupResponseModelv2 } from 'api/gen'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getVenue } from 'features/offer/helpers/getVenueBlockProps'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { analytics } from 'libs/analytics/provider'
import { getDistance } from 'libs/location/getDistance'
import { useLocation } from 'libs/location/location'
import { QueryKeys } from 'libs/queryKeys'
import { Subcategory } from 'libs/subcategories/types'
import { getImagesUrlsWithCredit } from 'shared/getImagesUrlsWithCredit/getImagesUrlsWithCredit'
import { Offer } from 'shared/offer/types'
import { usePageTracking } from 'shared/tracking/usePageTracking'
import { ImageWithCredit } from 'shared/types'

type UseOfferBodyDataParams = {
  offer: OfferResponse
  subcategory: Subcategory
  searchGroupList: SearchGroupResponseModelv2[]
  userId?: number
}

export type OfferBodyDataViewModel = {
  offerImages: ImageWithCredit[]
  placeholderImage: string | undefined
  imageDimensions: OfferImageContainerDimensions
  distance: string | null
  sameCategorySimilarOffers?: Offer[]
  apiRecoParamsSameCategory?: RecommendationApiParams
  otherCategoriesSimilarOffers?: Offer[]
  apiRecoParamsOtherCategories?: RecommendationApiParams
  onSeeMoreButtonPress: (chronicleId: number) => void
  onSeeAllReviewsPress: () => void
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
}

export const useOfferBodyData = ({
  offer,
  subcategory,
  searchGroupList,
  userId,
}: UseOfferBodyDataParams): OfferBodyDataViewModel => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Offer'>>()

  const pageTracking = usePageTracking({
    pageName: 'Offer',
    pageLocation: 'offer',
    pageId: params.id.toString(),
  })

  const {
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  } = useOfferPlaylist({ offer, offerSearchGroup: subcategory.searchGroupName, searchGroupList })

  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()
  const venue = getVenue(offer.venue)
  const distance = venue.coordinates
    ? (getDistance(
        { lat: venue.coordinates.latitude, lng: venue.coordinates.longitude },
        { userLocation, selectedPlace, selectedLocationMode },
        offer.subcategoryId
      ) ?? null)
    : null

  // We want to show images from offer when it's loaded. Not the one preloaded in query cache...
  const offerImages: ImageWithCredit[] = useMemo(
    () =>
      offer.metadata && offer.images ? getImagesUrlsWithCredit<ImageWithCredit>(offer.images) : [],
    [offer]
  )

  const queryClient = useQueryClient()
  const cachedOffer = queryClient.getQueryData<OfferResponse>([QueryKeys.OFFER, offer.id])

  // Extract cached image before it's been updated by next offer query
  const placeholderImage = useRef(cachedOffer?.images?.recto?.url).current

  const imageDimensions = useOfferImageContainerDimensions(offer.subcategoryId)

  const onSeeMoreButtonPress = (chronicleId: number) => {
    navigate('Chronicles', { offerId: offer.id, chronicleId, from: 'chronicles' })
    void analytics.logConsultChronicle({ offerId: offer.id, chronicleId })
  }

  const onSeeAllReviewsPress = () => {
    void analytics.logClickInfoReview({
      from: 'offer',
      offerId: offer.id.toString(),
      categoryName: subcategory.categoryId,
      userId: userId?.toString(),
    })
  }

  const onViewableItemsChanged = useCallback(
    (
      items: Pick<ViewToken, 'key' | 'index'>[],
      moduleId: string,
      itemType: 'offer' | 'venue' | 'artist' | 'unknown',
      playlistIndex?: number
    ) => {
      pageTracking.trackViewableItems({
        moduleId,
        itemType,
        viewableItems: items,
        playlistIndex,
        entryId: offer.id.toString(),
      })
    },
    [offer.id, pageTracking]
  )

  return {
    offerImages,
    placeholderImage,
    imageDimensions,
    distance,
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
    onSeeMoreButtonPress,
    onSeeAllReviewsPress,
    onViewableItemsChanged,
  }
}
