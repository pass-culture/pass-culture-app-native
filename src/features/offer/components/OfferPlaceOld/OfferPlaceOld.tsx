import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { OfferResponse } from 'api/gen'
import { useSearchVenueOffers } from 'api/useSearchVenuesOffer/useSearchVenueOffers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueSection } from 'features/offer/components/VenueSection/VenueSection'
import { VenueSelectionModal } from 'features/offer/components/VenueSelectionModal/VenueSelectionModal'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { getVenueSelectionHeaderMessage } from 'features/offer/helpers/getVenueSelectionHeaderMessage'
import { ANIMATION_DURATION } from 'features/venue/components/VenuePartialAccordionDescription/VenuePartialAccordionDescription'
import { analytics } from 'libs/analytics'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useLocation } from 'libs/location'
import { getIsMultivenueCompatibleOffer } from 'shared/multivenueOffer/getIsMultivenueCompatibleOffer'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Spacer } from 'ui/theme'

export type OfferPlaceOldProps = {
  offer: OfferResponse
  isEvent: boolean
}

export function OfferPlaceOld({ offer, isEvent }: Readonly<OfferPlaceOldProps>) {
  const { navigate } = useNavigation<UseNavigationType>()
  const showVenueBanner = offer.venue.isPermanent === true

  const venueSectionTitle = getVenueSectionTitle(offer.subcategoryId, isEvent)

  const { selectedLocationMode, place, userLocation } = useLocation()

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

  const venueName = offer.venue.publicName || offer.venue.name
  const headerMessage = getVenueSelectionHeaderMessage(selectedLocationMode, place, venueName)

  return (
    <React.Fragment>
      <SectionWithDivider visible={!offer.isDigital} margin>
        <VenueSection
          beforeNavigateToItinerary={handleBeforeNavigateToItinerary}
          venue={offer.venue}
          showVenueBanner={showVenueBanner}
          title={venueSectionTitle}
        />

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
