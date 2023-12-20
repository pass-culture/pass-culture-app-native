import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { OfferResponse } from 'api/gen'
import { useSearchVenueOffers } from 'api/useSearchVenuesOffer/useSearchVenueOffers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueSection } from 'features/offer/components/VenueSection/VenueSection'
import { VenueSelectionModal } from 'features/offer/components/VenueSelectionModal/VenueSelectionModal'
import { ANIMATION_DURATION } from 'features/venue/components/VenuePartialAccordionDescription/VenuePartialAccordionDescription'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { Position } from 'libs/location'
import { WhereSection } from 'libs/location/components/WhereSection'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Spacer } from 'ui/theme'

export type OfferPlaceProps = {
  offer: OfferResponse
  geolocPosition: Position
  isMultivenueCompatibleOffer: boolean
  showVenueBanner: boolean
  fullAddress: string
  venueSectionTitle: string
}

export function OfferPlace({
  offer,
  geolocPosition,
  isMultivenueCompatibleOffer,
  showVenueBanner,
  fullAddress,
  venueSectionTitle,
}: Readonly<OfferPlaceProps>) {
  const { navigate } = useNavigation<UseNavigationType>()
  const enableMultivenueOffer = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_MULTIVENUE_OFFER)
  const handleBeforeNavigateToItinerary = useCallback(() => {
    analytics.logConsultItinerary({ offerId: offer.id, from: 'offer' })
  }, [offer.id])

  const {
    visible: isChangeVenueModalVisible,
    showModal: showChangeVenueModal,
    hideModal: hideChangeVenueModal,
  } = useModal(false)

  const shouldFetchSearchVenueOffers = Boolean(
    enableMultivenueOffer && isMultivenueCompatibleOffer && offer.extraData?.ean
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
    geolocation: geolocPosition ?? {
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

  const shouldDisplayOtherVenuesAvailableButton = shouldFetchSearchVenueOffers && nbVenueItems > 0

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

  return (
    <React.Fragment>
      <SectionWithDivider visible={!offer.isDigital} margin>
        {enableMultivenueOffer ? (
          <VenueSection
            beforeNavigateToItinerary={handleBeforeNavigateToItinerary}
            venue={offer.venue}
            showVenueBanner={showVenueBanner}
            title={venueSectionTitle}
          />
        ) : (
          <WhereSection
            beforeNavigateToItinerary={handleBeforeNavigateToItinerary}
            venue={offer.venue}
            address={fullAddress}
            locationCoordinates={offer.venue.coordinates}
            showVenueBanner={showVenueBanner}
          />
        )}
        {shouldDisplayOtherVenuesAvailableButton ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <ButtonSecondary
              wording="Voir d’autres lieux disponibles"
              fullWidth
              onPress={onShowChangeVenueModal}
            />
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        ) : null}
      </SectionWithDivider>

      {shouldDisplayOtherVenuesAvailableButton ? (
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
          isSharingLocation={geolocPosition !== null}
          venueName={offer.venue.publicName || offer.venue.name}
        />
      ) : null}
    </React.Fragment>
  )
}
