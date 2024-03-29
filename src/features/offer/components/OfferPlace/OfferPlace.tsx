import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useQueryClient } from 'react-query'
import { useTheme } from 'styled-components/native'

import { OfferResponse, VenueResponse } from 'api/gen'
import { useSearchVenueOffers } from 'api/useSearchVenuesOffer/useSearchVenueOffers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferVenueBlock } from 'features/offer/components/OfferVenueBlock/OfferVenueBlock'
import { OfferVenueBlockDeprecated } from 'features/offer/components/OfferVenueBlock/OfferVenueBlockDeprecated'
import { VenueSelectionModal } from 'features/offer/components/VenueSelectionModal/VenueSelectionModal'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { getVenueSelectionHeaderMessage } from 'features/offer/helpers/getVenueSelectionHeaderMessage'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useLocation } from 'libs/location'
import { useDistance } from 'libs/location/hooks/useDistance'
import { QueryKeys } from 'libs/queryKeys'
import { getIsMultiVenueCompatibleOffer } from 'shared/multiVenueOffer/getIsMultiVenueCompatibleOffer'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Spacer } from 'ui/theme'

export type OfferPlaceProps = {
  offer: OfferResponse
  isEvent: boolean
}

type PartialVenue = Pick<
  VenueResponse,
  'id' | 'venueTypeCode' | 'name' | 'description' | 'publicName'
>

const mergeVenueData =
  (venue: PartialVenue) =>
  (prevData: VenueResponse | undefined): VenueResponse => ({
    id: venue.id,
    name: venue.publicName || venue.name,
    venueTypeCode: venue.venueTypeCode,
    isVirtual: false,
    description: venue.description,
    accessibility: {},
    contact: {},
    ...(prevData ?? {}),
  })

const ANIMATION_DURATION = 500 //ms

export function OfferPlace({ offer, isEvent }: Readonly<OfferPlaceProps>) {
  const { navigate } = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()
  const { selectedLocationMode, place, userLocation } = useLocation()
  const { isDesktopViewport } = useTheme()

  const hasNewOfferVenueBlock = useFeatureFlag(RemoteStoreFeatureFlags.WIP_CINEMA_OFFER_VENUE_BLOCK)

  const { latitude: lat, longitude: lng } = offer.venue.coordinates
  const distanceToLocation = useDistance({ lat, lng })

  const venueSectionTitle = getVenueSectionTitle(offer.subcategoryId, isEvent)

  const handleBeforeNavigateToItinerary = useCallback(() => {
    analytics.logConsultItinerary({ offerId: offer.id, from: 'offer' })
  }, [offer.id])

  const {
    visible: isChangeVenueModalVisible,
    showModal: showChangeVenueModal,
    hideModal: hideChangeVenueModal,
  } = useModal(false)

  const { shouldFetchSearchVenueOffers, multiVenueQuery } = getIsMultiVenueCompatibleOffer(
    offer,
    hasNewOfferVenueBlock
  )

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
  } = useSearchVenueOffers({
    offerId: offer.id,
    venueId: offer.venue.id,
    geolocation: userLocation ?? {
      latitude: offer.venue.coordinates.latitude ?? 0,
      longitude: offer.venue.coordinates.longitude ?? 0,
    },
    query: multiVenueQuery,
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
      analytics.logConsultOffer({
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
  const venueName = offer.venue.publicName || offer.venue.name
  const headerMessage = getVenueSelectionHeaderMessage(selectedLocationMode, place, venueName)

  const renderOfferVenueBlock = () => {
    return (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={8} />
        {hasNewOfferVenueBlock ? (
          <OfferVenueBlock
            title={venueSectionTitle}
            offer={offer}
            distance={distanceToLocation}
            onChangeVenuePress={shouldDisplayChangeVenueButton ? onShowChangeVenueModal : undefined}
            onSeeVenuePress={offer.venue.isPermanent ? handleOnSeeVenuePress : undefined}
            onSeeItineraryPress={
              shouldDisplaySeeItineraryButton ? handleBeforeNavigateToItinerary : undefined
            }
          />
        ) : (
          <OfferVenueBlockDeprecated
            title={venueSectionTitle}
            venue={offer.venue}
            distance={distanceToLocation}
            onChangeVenuePress={shouldDisplayChangeVenueButton ? onShowChangeVenueModal : undefined}
            onSeeVenuePress={offer.venue.isPermanent ? handleOnSeeVenuePress : undefined}
            onSeeItineraryPress={
              shouldDisplaySeeItineraryButton ? handleBeforeNavigateToItinerary : undefined
            }
          />
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {isDesktopViewport ? (
        <View testID="place-container-without-divider">{renderOfferVenueBlock()}</View>
      ) : (
        <SectionWithDivider visible={!offer.isDigital} margin testID="place-container-with-divider">
          {renderOfferVenueBlock()}
        </SectionWithDivider>
      )}
      <Spacer.Column numberOfSpaces={8} />

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
