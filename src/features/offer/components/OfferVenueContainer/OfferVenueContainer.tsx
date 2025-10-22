import { useNavigation } from '@react-navigation/native'
import React, { FC, Fragment } from 'react'

import { OfferResponseV2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferVenueBlock } from 'features/offer/components/OfferVenueBlock/OfferVenueBlock'
import { VenueSelectionModal } from 'features/offer/components/VenueSelectionModal/VenueSelectionModal'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { getVenueSelectionHeaderMessage } from 'features/offer/helpers/getVenueSelectionHeaderMessage'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useLocation } from 'libs/location/location'
import { Subcategory } from 'libs/subcategories/types'
import { useSearchVenueOffersInfiniteQuery } from 'queries/searchVenuesOffer/useSearchVenueOffersInfiniteQuery'
import { isMultiVenueCompatibleOffer } from 'shared/multiVenueOffer/isMultiVenueCompatibleOffer'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'

const ANIMATION_DURATION = 500 //ms

type Props = {
  offer: OfferResponseV2
  subcategory: Subcategory
  handleOnSeeVenuePress?: VoidFunction
  distance?: string | null
}

export const OfferVenueContainer: FC<Props> = ({
  offer,
  distance,
  subcategory,
  handleOnSeeVenuePress,
}) => {
  const venueSectionTitle = getVenueSectionTitle(offer.subcategoryId, subcategory.isEvent)

  const handleBeforeNavigateToItinerary = async () => {
    await analytics.logConsultItinerary({ offerId: offer.id, from: 'offer' })
  }

  const onShowChangeVenueModal = async () => {
    showChangeVenueModal()
    await analytics.logMultivenueOptionDisplayed(offer.id)
  }

  const shouldDisplaySeeItineraryButton = Boolean(
    offer.venue.address && offer.venue.postalCode && offer.venue.city
  )

  const canSeeVenue = offer.venue.isPermanent

  const { selectedLocationMode, place, userLocation } = useLocation()

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
    enabled: shouldFetchSearchVenueOffers,
  })

  const { navigate } = useNavigation<UseNavigationType>()

  const shouldDisplayChangeVenueButton = shouldFetchSearchVenueOffers && nbVenueItems > 0

  const onEndReached = async () => {
    if (data && hasNextPage) {
      await fetchNextPage()
    }
  }

  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)

  const { onScroll: onScrollModal } = useOpacityTransition()

  const onNewOfferVenueSelected = (nextOfferId: number) => {
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
  }

  const headerMessage = getVenueSelectionHeaderMessage(
    selectedLocationMode,
    place,
    offer.venue.name
  )

  return (
    <Fragment>
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
    </Fragment>
  )
}
