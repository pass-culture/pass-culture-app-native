import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'styled-components/native'

import { OfferResponseV2, SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { MovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/MovieScreeningCalendar'
import { OfferCineBlock } from 'features/offer/components/OfferCine/OfferCineBlock'
import { OfferVenueBlock } from 'features/offer/components/OfferVenueBlock/OfferVenueBlock'
import { VenueSelectionModal } from 'features/offer/components/VenueSelectionModal/VenueSelectionModal'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { getVenueSelectionHeaderMessage } from 'features/offer/helpers/getVenueSelectionHeaderMessage'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useLocation } from 'libs/location'
import { QueryKeys } from 'libs/queryKeys'
import { Subcategory } from 'libs/subcategories/types'
import { useSearchVenueOffersInfiniteQuery } from 'queries/searchVenuesOffer/useSearchVenueOffersInfiniteQuery'
import { isMultiVenueCompatibleOffer } from 'shared/multiVenueOffer/isMultiVenueCompatibleOffer'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export type OfferPlaceProps = {
  offer: OfferResponseV2
  subcategory: Subcategory
  distance?: string | null
}

type PartialVenue = Pick<
  VenueResponse,
  'id' | 'venueTypeCode' | 'name' | 'description' | 'isOpenToPublic'
>

const mergeVenueData =
  (venue: PartialVenue) =>
  (prevData: VenueResponse | undefined): VenueResponse => ({
    id: venue.id,
    name: venue.name,
    venueTypeCode: venue.venueTypeCode,
    isVirtual: false,
    description: venue.description,
    accessibility: {},
    contact: {},
    timezone: '',
    isOpenToPublic: venue.isOpenToPublic,
    ...(prevData ?? {}),
  })

const ANIMATION_DURATION = 500 //ms

export function OfferPlace({ offer, subcategory, distance }: Readonly<OfferPlaceProps>) {
  const { navigate } = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()
  const { selectedLocationMode, place, userLocation } = useLocation()
  const { isDesktopViewport } = useTheme()

  const enableCineFromOffer = useFeatureFlag(RemoteStoreFeatureFlags.TARGET_XP_CINE_FROM_OFFER)

  const venueSectionTitle = getVenueSectionTitle(offer.subcategoryId, subcategory.isEvent)

  const handleBeforeNavigateToItinerary = useCallback(() => {
    analytics.logConsultItinerary({ offerId: offer.id, from: 'offer' })
  }, [offer.id])

  const {
    visible: isChangeVenueModalVisible,
    showModal: showChangeVenueModal,
    hideModal: hideChangeVenueModal,
  } = useModal(false)

  const shouldFetchSearchVenueOffers = isMultiVenueCompatibleOffer(offer)

  const {
    hasNextPage,
    fetchNextPage,
    refetch,
    data,
    venueList,
    isFetching,
    nbVenueItems,
    nbLoadedHits,
    nbHits,
    isFetchingNextPage,
  } = useSearchVenueOffersInfiniteQuery({
    offerId: offer.id,
    venueId: offer.venue.id,
    geolocation: userLocation ?? {
      latitude: offer.venue.coordinates.latitude ?? 0,
      longitude: offer.venue.coordinates.longitude ?? 0,
    },
    ean: offer.extraData?.ean ?? undefined,
    allocineId: offer.extraData?.allocineId ?? undefined,
    queryOptions: { enabled: shouldFetchSearchVenueOffers },
  })

  const onShowChangeVenueModal = useCallback(() => {
    showChangeVenueModal()
    analytics.logMultivenueOptionDisplayed(offer.id)
  }, [offer.id, showChangeVenueModal])

  const onEndReached = useCallback(() => {
    if (data && hasNextPage) {
      fetchNextPage()
    }
  }, [data, fetchNextPage, hasNextPage])

  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)

  const { onScroll: onScrollModal } = useOpacityTransition()

  const shouldDisplayChangeVenueButton = shouldFetchSearchVenueOffers && nbVenueItems > 0

  const onNewOfferVenueSelected = useCallback(
    (nextOfferId: number) => {
      hideChangeVenueModal()
      triggerConsultOfferLog({
        offerId: nextOfferId,
        from: 'offer',
        fromMultivenueOfferId: offer.id,
      })
      navigate('Offer', {
        fromOfferId: offer.id,
        id: nextOfferId,
        fromMultivenueOfferId: offer.id,
      })
    },
    [hideChangeVenueModal, navigate, offer.id]
  )

  const handleOnSeeVenuePress = useCallback(() => {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, offer.venue.id], mergeVenueData(offer.venue))
    analytics.logConsultVenue({ venueId: offer.venue.id, from: 'offer' })
    navigate('Venue', { id: offer.venue.id })
  }, [navigate, queryClient, offer.venue])

  const shouldDisplaySeeItineraryButton = Boolean(
    offer.venue.address && offer.venue.postalCode && offer.venue.city
  )
  const headerMessage = getVenueSelectionHeaderMessage(
    selectedLocationMode,
    place,
    offer.venue.name
  )

  const isOfferAMovieScreening = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE

  const canSeeVenue = offer.venue.isPermanent

  const renderOfferVenueBlock = useCallback(() => {
    return (
      <ViewGap gap={8}>
        {isOfferAMovieScreening && enableCineFromOffer ? (
          <OfferCineBlock
            title={venueSectionTitle}
            offer={offer}
            onSeeVenuePress={canSeeVenue ? handleOnSeeVenuePress : undefined}
            distance={distance}
          />
        ) : (
          <OfferVenueBlock
            title={venueSectionTitle}
            offer={offer}
            onChangeVenuePress={shouldDisplayChangeVenueButton ? onShowChangeVenueModal : undefined}
            onSeeVenuePress={canSeeVenue ? handleOnSeeVenuePress : undefined}
            onSeeItineraryPress={
              shouldDisplaySeeItineraryButton ? handleBeforeNavigateToItinerary : undefined
            }
            distance={distance}
          />
        )}

        {isOfferAMovieScreening && !enableCineFromOffer ? (
          <MovieScreeningCalendar offer={offer} subcategory={subcategory} />
        ) : null}
      </ViewGap>
    )
  }, [
    canSeeVenue,
    distance,
    enableCineFromOffer,
    handleBeforeNavigateToItinerary,
    handleOnSeeVenuePress,
    isOfferAMovieScreening,
    offer,
    onShowChangeVenueModal,
    shouldDisplayChangeVenueButton,
    shouldDisplaySeeItineraryButton,
    subcategory,
    venueSectionTitle,
  ])

  return (
    <React.Fragment>
      {!offer.isDigital && isDesktopViewport ? (
        <View testID="place-container-without-divider">{renderOfferVenueBlock()}</View>
      ) : (
        <SectionWithDivider
          visible={!offer.isDigital}
          testID="place-container-with-divider"
          gap={8}>
          {renderOfferVenueBlock()}
        </SectionWithDivider>
      )}

      {shouldDisplayChangeVenueButton ? (
        <VenueSelectionModal
          isVisible={isChangeVenueModalVisible}
          items={venueList}
          title={venueSectionTitle}
          onSubmit={onNewOfferVenueSelected}
          onClosePress={hideChangeVenueModal}
          onEndReached={onEndReached}
          refreshing={isRefreshing}
          onRefresh={refetch}
          onScroll={onScrollModal}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage={isFetchingNextPage}
          isSharingLocation={userLocation !== null}
          subTitle="Sélectionner un lieu"
          rightIconAccessibilityLabel="Ne pas sélectionner un autre lieu"
          validateButtonLabel="Choisir ce lieu"
          headerMessage={headerMessage}
        />
      ) : null}
    </React.Fragment>
  )
}
