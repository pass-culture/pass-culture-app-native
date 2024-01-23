import { useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform } from 'react-native'
import styled from 'styled-components/native'

import {
  NativeCategoryIdEnumv2,
  OfferResponse,
  SearchGroupNameEnumv2,
  SearchGroupResponseModelv2,
} from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { useOfferAnalytics } from 'features/offer/helpers/useOfferAnalytics/useOfferAnalytics'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { isCloseToBottom } from 'libs/analytics'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

type Props = {
  offer: OfferResponse
  offerNativeCategory: NativeCategoryIdEnumv2
  offerSearchGroup: SearchGroupNameEnumv2
  searchGroupList: SearchGroupResponseModelv2[]
}

const PLAYLIST_HEIGHT = 300

const getPlaylistsHeight = (numberOfPlaylists: number) => {
  return PLAYLIST_HEIGHT * numberOfPlaylists
}

const isWeb = Platform.OS === 'web'

const DELAY_BEFORE_CONSIDERING_PAGE_SEEN = 5000

export function OfferContent({
  offer,
  offerNativeCategory,
  offerSearchGroup,
  searchGroupList,
}: Readonly<Props>) {
  const route = useRoute<UseRouteType<'Offer'>>()

  const fromOfferId = route.params.fromOfferId

  const { trackEventHasSeenOfferOnce, trackBatchEvent, shouldTriggerBatchSurveyEvent } =
    useOfferBatchTracking({ offerNativeCategory })

  const {
    sameArtistPlaylist,
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  } = useOfferPlaylist({ offer, offerSearchGroup, searchGroupList })
  const hasSameCategorySimilarOffers = Boolean(sameCategorySimilarOffers?.length)
  const hasOtherCategoriesSimilarOffers = Boolean(otherCategoriesSimilarOffers?.length)

  const {
    logSameCategoryPlaylistVerticalScroll,
    logOtherCategoriesPlaylistVerticalScroll,
    logSameArtistPlaylistVerticalScroll,
    logConsultWholeOffer,
  } = useOfferAnalytics({
    offerId: offer.id,
    nbSameArtistPlaylist: sameArtistPlaylist.length,
    apiRecoParamsSameCategory,
    nbSameCategorySimilarOffers: sameCategorySimilarOffers?.length ?? 0,
    apiRecoParamsOtherCategories,
    nbOtherCategoriesSimilarOffers: otherCategoriesSimilarOffers?.length ?? 0,
    fromOfferId,
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (shouldTriggerBatchSurveyEvent) {
      timeoutId = setTimeout(() => {
        trackBatchEvent()
      }, DELAY_BEFORE_CONSIDERING_PAGE_SEEN)
    }

    return () => clearTimeout(timeoutId)
  }, [shouldTriggerBatchSurveyEvent, trackBatchEvent])

  const handleChangeSameArtistPlaylistDisplay = useCallback(
    (inView: boolean) => {
      if (!inView) return

      logSameArtistPlaylistVerticalScroll()
    },
    [logSameArtistPlaylistVerticalScroll]
  )

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

  return (
    <Container>
      <OfferWebMetaHeader offer={offer} />
      {isWeb ? (
        <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
      ) : null}
      <OfferBody
        offer={offer}
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
      <OfferCTAButton offer={offer} trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
