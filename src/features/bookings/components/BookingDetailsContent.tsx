import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { BookingOfferResponseAddress, BookingReponse, BookingVenueResponse } from 'api/gen'
import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingPrecisions } from 'features/bookings/components/BookingPrecision'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { TicketBody } from 'features/bookings/components/TicketBody/TicketBody'
import { TicketCutout } from 'features/bookings/components/TicketCutout'
import { getBookingLabels } from 'features/bookings/helpers'
import { BookingProperties } from 'features/bookings/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { VenueBlockWithItinerary } from 'features/offer/components/OfferVenueBlock/VenueBlockWithItinerary'
import { analytics } from 'libs/analytics/provider'
import { useLocation } from 'libs/location'
import { getDistance } from 'libs/location/getDistance'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { theme } from 'theme'
import { ErrorBanner } from 'ui/components/banners/ErrorBanner'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { IdCard } from 'ui/svg/icons/IdCard'
import { getSpacing } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(15)

export const BookingDetailsContent = ({
  properties,
  booking,
  mapping,
}: {
  properties: BookingProperties
  booking: BookingReponse
  mapping: SubcategoriesMapping
}) => {
  const { address } = booking?.stock.offer ?? {}
  const { visible: cancelModalVisible, showModal: showCancelModal, hideModal } = useModal(false)
  const {
    visible: archiveModalVisible,
    showModal: showArchiveModal,
    hideModal: hideArchiveModal,
  } = useModal(false)
  const offerFullAddress = address
    ? formatFullAddress(address.street, address.postalCode, address.city)
    : undefined

  const { offer } = booking.stock
  const shouldDisplayItineraryButton =
    !!offerFullAddress && (properties.isEvent || (properties.isPhysical && !properties.isDigital))

  const { hourLabel, dayLabel } = getBookingLabels(booking, properties)

  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()

  const distance = offer.venue.coordinates
    ? getDistance(
        { lat: offer.venue.coordinates.latitude, lng: offer.venue.coordinates.longitude },
        { userLocation, selectedPlace, selectedLocationMode }
      )
    : null

  const onEmailPress = () => {
    analytics.logClickEmailOrganizer()
  }
  const cancelBooking = () => {
    showCancelModal()
    analytics.logCancelBooking(offer.id)
  }

  const { goBack } = useGoBack(...getTabNavConfig('Bookings'))

  return (
    <ScrollView>
      <RoundedButton
        iconName="back"
        onPress={goBack}
        accessibilityLabel="Revenir en arrière"
        finalColor={theme.colors.black}
        initialColor={theme.colors.black}
      />
      <TicketCutout
        hour={hourLabel == '' ? undefined : hourLabel}
        day={dayLabel == '' ? undefined : dayLabel}
        isDuo={properties.isDuo}
        offer={offer}
        mapping={mapping}
        venueInfo={
          <VenueBlockWithItinerary
            shouldDisplayItineraryButton={shouldDisplayItineraryButton}
            offerFullAddress={offerFullAddress}
            venue={getVenueBlockVenue(booking.stock.offer.venue)}
            address={getVenueBlockAddress(booking.stock.offer.address)}
            offerId={offer.id}
            thumbnailSize={VENUE_THUMBNAIL_SIZE}
            distance={distance}
          />
        }
        title={offer.name}
        infoBanner={
          <InfoBanner
            message="Tu auras besoin de ta carte d’identité pour accéder à l’évènement."
            icon={IdCard}
          />
        }>
        <TicketBody withdrawalType={offer.withdrawalType} />
      </TicketCutout>
      <ErrorBannerContainer>
        <ErrorBanner message="Tu n’as pas le droit de céder ou de revendre ton billet." />
      </ErrorBannerContainer>
      {booking.stock.offer.bookingContact || offer.withdrawalDetails ? (
        <React.Fragment>
          <StyledSeparator height={getSpacing(8)} />
          <BookingPrecisions
            bookingContactEmail={booking.stock.offer.bookingContact}
            withdrawalDetails={offer.withdrawalDetails}
            onEmailPress={onEmailPress}
          />
        </React.Fragment>
      ) : null}
      <StyledSeparator height={getSpacing(8)} />
      <BookingDetailsCancelButton
        booking={booking}
        onCancel={cancelBooking}
        onTerminate={showArchiveModal}
        fullWidth
      />
      <CancelBookingModal visible={cancelModalVisible} dismissModal={hideModal} booking={booking} />
      <ArchiveBookingModal
        visible={archiveModalVisible}
        bookingId={booking.id}
        bookingTitle={offer.name}
        onDismiss={hideArchiveModal}
      />
    </ScrollView>
  )
}

function getVenueBlockVenue(venue: BookingVenueResponse): VenueBlockVenue {
  return venue
}

function getVenueBlockAddress(
  address: BookingOfferResponseAddress | null | undefined
): VenueBlockAddress | undefined {
  return address ?? undefined
}

const ErrorBannerContainer = styled.View({
  marginHorizontal: getSpacing(6),
  marginTop: getSpacing(8),
})
const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(8),
  height: getSpacing(2),
})
