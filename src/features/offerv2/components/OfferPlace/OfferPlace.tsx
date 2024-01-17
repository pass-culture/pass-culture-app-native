import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useQueryClient } from 'react-query'

import { OfferResponse, VenueResponse } from 'api/gen'
import { useSearchVenueOffers } from 'api/useSearchVenuesOffer/useSearchVenueOffers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueSelectionModal } from 'features/offer/components/VenueSelectionModal/VenueSelectionModal'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { OfferVenueBlock } from 'features/offerv2/components/OfferVenueBlock/OfferVenueBlock'
import { ANIMATION_DURATION } from 'features/venue/components/VenuePartialAccordionDescription/VenuePartialAccordionDescription'
import { analytics } from 'libs/analytics'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { Position } from 'libs/location'
import { useDistance } from 'libs/location/hooks/useDistance'
import { QueryKeys } from 'libs/queryKeys'
import { getIsMultivenueCompatibleOffer } from 'shared/multivenueOffer/getIsMultivenueCompatibleOffer'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Spacer } from 'ui/theme'

type OfferPlaceProps = {
  offer: OfferResponse
  userLocation: Position
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

export function OfferPlace({ offer, userLocation, isEvent }: Readonly<OfferPlaceProps>) {
  const { navigate } = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()

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

  const { shouldFetchSearchVenueOffers } = getIsMultivenueCompatibleOffer(offer)

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
    query: offer.extraData?.ean ?? '',
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

  return (
    <React.Fragment>
      <SectionWithDivider visible={!offer.isDigital} margin>
        <Spacer.Column numberOfSpaces={8} />
        <OfferVenueBlock
          title={venueSectionTitle}
          venue={offer.venue}
          distance={distanceToLocation}
          onChangeVenuePress={shouldDisplayChangeVenueButton ? onShowChangeVenueModal : undefined}
          onSeeVenuePress={offer.venue.isPermanent ? handleOnSeeVenuePress : undefined}
          onSeeItineraryPress={
            shouldDisplaySeeItineraryButton ? handleBeforeNavigateToItinerary : undefined
          }
        />
      </SectionWithDivider>

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
          venueName={offer.venue.publicName || offer.venue.name}
        />
      ) : null}
    </React.Fragment>
  )
}
