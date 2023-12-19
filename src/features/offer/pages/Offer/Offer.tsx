import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform } from 'react-native'
import styled from 'styled-components/native'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { StepperOrigin, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { useSimilarOffers } from 'features/offer/api/useSimilarOffers'
import { BottomBanner } from 'features/offer/components/BottomBanner/BottomBanner'
import { CTAButton } from 'features/offer/components/CTAButton/CTAButton'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { useSameArtistPlaylist } from 'features/offer/components/OfferPlaylist/hook/useSameArtistPlaylist'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { PlaylistType } from 'features/offer/enums'
import { getIsFreeDigitalOffer } from 'features/offer/helpers/getIsFreeDigitalOffer/getIsFreeDigitalOffer'
import { getSearchGroupAndNativeCategoryFromSubcategoryId } from 'features/offer/helpers/getSearchGroupAndNativeCategoryFromSubcategoryId/getSearchGroupAndNativeCategoryFromSubcategoryId'
import { useCtaWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { analytics, isCloseToBottom } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { Position, useLocation } from 'libs/location'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { getSpacing, Spacer } from 'ui/theme'

const trackEventHasSeenOffer = () => BatchUser.trackEvent(BatchEvent.hasSeenOffer)

const OFFER_NATIVE_CATEGORIES_ELIGIBLE_FOR_SURVEY = [
  NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
  NativeCategoryIdEnumv2.VISITES_CULTURELLES,
  NativeCategoryIdEnumv2.LIVRES_PAPIER,
  NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS,
]
const trackEventHasSeenOfferForSurvey = () => BatchUser.trackEvent(BatchEvent.hasSeenOfferForSurvey)

const PLAYLIST_HEIGHT = 300

const getPlaylistsHeight = (numberOfPlaylists: number) => {
  return PLAYLIST_HEIGHT * numberOfPlaylists
}

const isWeb = Platform.OS === 'web'

export function Offer() {
  const route = useRoute<UseRouteType<'Offer'>>()
  const { isLoggedIn } = useAuthContext()
  const trackEventHasSeenOfferOnce = useFunctionOnce(trackEventHasSeenOffer)
  const trackEventHasSeenOfferForSurveyOnce = useFunctionOnce(trackEventHasSeenOfferForSurvey)
  const offerId = route.params?.id
  const searchId = route.params?.searchId
  const from = route.params?.from

  const trackBookOfferForSurveyOnce = useFunctionOnce(() => {
    BatchUser.trackEvent(BatchEvent.hasSeenBookOfferForSurvey)
  })
  const trackCinemaOfferForSurveyOnce = useFunctionOnce(() => {
    BatchUser.trackEvent(BatchEvent.hasSeenCinemaOfferForSurvey)
  })
  const trackCulturalVisitOfferForSurveyOnce = useFunctionOnce(() => {
    BatchUser.trackEvent(BatchEvent.hasSeenCulturalVisitForSurvey)
  })
  const trackConcertOfferForSurveyOnce = useFunctionOnce(() => {
    BatchUser.trackEvent(BatchEvent.hasSeenConcertForSurvey)
  })

  const { geolocPosition } = useLocation()

  const { data: offer } = useOffer({ offerId })
  const { data } = useSubcategories()

  const logConsultWholeOffer = useFunctionOnce(() => {
    if (offer) {
      analytics.logConsultWholeOffer(offer.id)
    }
  })

  const { latitude, longitude } = geolocPosition ?? {}
  const roundedPosition: Position = useMemo(() => {
    return {
      latitude: Number(latitude?.toFixed(3)),
      longitude: Number(longitude?.toFixed(3)),
    }
  }, [latitude, longitude])

  const { searchGroupName, nativeCategory } =
    getSearchGroupAndNativeCategoryFromSubcategoryId(data, offer?.subcategoryId) || {}

  const artists = offer?.extraData?.author
  const ean = offer?.extraData?.ean
  const venueLocation = offer?.venue?.coordinates

  const { sameArtistPlaylist, refetch } = useSameArtistPlaylist({
    artists,
    ean,
    searchGroupName,
    venueLocation,
  })

  useEffect(() => {
    if (artists && ean) {
      refetch()
    }
  }, [artists, ean, refetch])

  const { similarOffers: sameCategorySimilarOffers, apiRecoParams: apiRecoParamsSameCategory } =
    useSimilarOffers({
      offerId: offer?.id,
      position: geolocPosition ? roundedPosition : undefined,
      categoryIncluded: searchGroupName ?? SearchGroupNameEnumv2.NONE,
    })
  const hasSameCategorySimilarOffers = Boolean(sameCategorySimilarOffers?.length)

  const {
    similarOffers: otherCategoriesSimilarOffers,
    apiRecoParams: apiRecoParamsOtherCategories,
  } = useSimilarOffers({
    offerId: offer?.id,
    position: geolocPosition ? roundedPosition : undefined,
    categoryExcluded: searchGroupName ?? SearchGroupNameEnumv2.NONE,
    searchGroupList: data?.searchGroups,
  })
  const hasOtherCategoriesSimilarOffers = Boolean(otherCategoriesSimilarOffers?.length)

  const fromOfferId = route.params?.fromOfferId

  const isFreeDigitalOffer = getIsFreeDigitalOffer(offer)

  const shouldTriggerBatchSurveyEvent =
    nativeCategory && OFFER_NATIVE_CATEGORIES_ELIGIBLE_FOR_SURVEY.includes(nativeCategory)

  const logSameCategoryPlaylistVerticalScroll = useFunctionOnce(() => {
    return analytics.logPlaylistVerticalScroll({
      ...apiRecoParamsSameCategory,
      fromOfferId,
      offerId,
      playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      nbResults: sameCategorySimilarOffers?.length ?? 0,
    })
  })

  const logOtherCategoriesPlaylistVerticalScroll = useFunctionOnce(() => {
    return analytics.logPlaylistVerticalScroll({
      ...apiRecoParamsOtherCategories,
      fromOfferId,
      offerId,
      playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      nbResults: otherCategoriesSimilarOffers?.length ?? 0,
    })
  })

  const logSameArtistPlaylistVerticalScroll = useFunctionOnce(() => {
    return analytics.logPlaylistVerticalScroll({
      fromOfferId,
      offerId,
      playlistType: PlaylistType.SAME_ARTIST_PLAYLIST,
      nbResults: sameArtistPlaylist.length,
    })
  })

  const trackBatchEvent = useCallback(() => {
    trackEventHasSeenOfferForSurveyOnce()

    if (nativeCategory === NativeCategoryIdEnumv2.LIVRES_PAPIER) {
      trackBookOfferForSurveyOnce()
    }

    if (nativeCategory === NativeCategoryIdEnumv2.VISITES_CULTURELLES) {
      trackCulturalVisitOfferForSurveyOnce()
    }

    if (nativeCategory === NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS) {
      trackConcertOfferForSurveyOnce()
    }

    if (nativeCategory === NativeCategoryIdEnumv2.SEANCES_DE_CINEMA) {
      trackCinemaOfferForSurveyOnce()
    }
  }, [
    nativeCategory,
    trackBookOfferForSurveyOnce,
    trackCinemaOfferForSurveyOnce,
    trackConcertOfferForSurveyOnce,
    trackCulturalVisitOfferForSurveyOnce,
    trackEventHasSeenOfferForSurveyOnce,
  ])

  const handleLogPlaylistVerticalScroll = useCallback(
    (nativeEvent: NativeScrollEvent) => {
      // The log event is triggered when the similar offer playlist is visible
      const hasTwoSimilarOffersPlaylist =
        hasSameCategorySimilarOffers && hasOtherCategoriesSimilarOffers

      if (
        isCloseToBottom({
          ...nativeEvent,
          padding: getPlaylistsHeight(2),
        }) &&
        hasTwoSimilarOffersPlaylist
      ) {
        logSameCategoryPlaylistVerticalScroll()
      }

      if (
        isCloseToBottom({
          ...nativeEvent,
          padding: getPlaylistsHeight(1),
        })
      ) {
        if (hasTwoSimilarOffersPlaylist || hasOtherCategoriesSimilarOffers) {
          logOtherCategoriesPlaylistVerticalScroll()
        } else if (!hasTwoSimilarOffersPlaylist && hasSameCategorySimilarOffers) {
          logSameCategoryPlaylistVerticalScroll()
        }
      }
    },
    [
      hasOtherCategoriesSimilarOffers,
      hasSameCategorySimilarOffers,
      logOtherCategoriesPlaylistVerticalScroll,
      logSameCategoryPlaylistVerticalScroll,
    ]
  )

  const handleChangeSameArtistPlaylistDisplay = (inView: boolean) => {
    if (!inView) return

    logSameArtistPlaylistVerticalScroll()
  }

  const scrollEventListener = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom(nativeEvent)) {
        logConsultWholeOffer()
        if (shouldTriggerBatchSurveyEvent) {
          trackBatchEvent()
        }
      }
      handleLogPlaylistVerticalScroll(nativeEvent)
    },
    [
      handleLogPlaylistVerticalScroll,
      logConsultWholeOffer,
      shouldTriggerBatchSurveyEvent,
      trackBatchEvent,
    ]
  )

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: scrollEventListener,
  })

  const {
    wording,
    onPress: onPressCTA,
    navigateTo,
    externalNav,
    modalToDisplay,
    isEndedUsedBooking,
    bottomBannerText,
    isDisabled,
  } = useCtaWordingAndAction({ offer, from, searchId }) ?? {}

  const { OfferModal: CTAOfferModal, showModal: showOfferModal } = useBookOfferModal({
    modalToDisplay,
    offerId,
    isEndedUsedBooking,
    from: StepperOrigin.OFFER,
  })

  useFocusEffect(
    useCallback(() => {
      trackEventHasSeenOfferOnce()
      if (route.params.openModalOnNavigation) {
        showOfferModal()
      }
    }, [trackEventHasSeenOfferOnce, route.params.openModalOnNavigation, showOfferModal])
  )

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (shouldTriggerBatchSurveyEvent) {
      timeoutId = setTimeout(() => {
        trackBatchEvent()
      }, 5000)
    }

    return () => clearTimeout(timeoutId)
  }, [shouldTriggerBatchSurveyEvent, trackBatchEvent])

  const onPress = () => {
    onPressCTA?.()
    showOfferModal()
  }

  if (!offer) return null

  return (
    <Container>
      <OfferWebMetaHeader offer={offer} />
      {isWeb ? (
        <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
      ) : null}
      <OfferBody
        offerId={offerId}
        onScroll={onScroll}
        sameCategorySimilarOffers={sameCategorySimilarOffers}
        apiRecoParamsSameCategory={apiRecoParamsSameCategory}
        otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
        apiRecoParamsOtherCategories={apiRecoParamsOtherCategories}
        sameArtistPlaylist={sameArtistPlaylist}
        handleChangeSameArtistPlaylistDisplay={handleChangeSameArtistPlaylistDisplay}
      />
      {/* OfferHeader is called after Body to implement the BlurView for iOS */}
      {!isWeb ? (
        <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
      ) : null}
      {!!wording && (
        <React.Fragment>
          <CallToActionContainer testID="CTA-button">
            <CTAButton
              wording={wording}
              onPress={onPress}
              navigateTo={navigateTo}
              externalNav={externalNav}
              isDisabled={isDisabled}
              isFreeDigitalOffer={isFreeDigitalOffer}
              isLoggedIn={isLoggedIn}
            />
            <Spacer.Column numberOfSpaces={bottomBannerText ? 4.5 : 6} />
          </CallToActionContainer>
          {bottomBannerText ? <BottomBanner text={bottomBannerText} /> : <Spacer.BottomScreen />}
        </React.Fragment>
      )}

      {CTAOfferModal}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const CallToActionContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
