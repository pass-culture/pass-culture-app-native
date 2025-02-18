import React from 'react'

import { BookingOfferResponseAddress, BookingReponse, BookingVenueResponse } from 'api/gen'
import { TicketCutout } from 'features/bookings/components/TicketCutout'
import { getBookingLabels } from 'features/bookings/helpers'
import { BookingProperties } from 'features/bookings/types'
import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { VenueBlockWithItinerary } from 'features/offer/components/OfferVenueBlock/VenueBlockWithItinerary'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { IdCard } from 'ui/svg/icons/IdCard'
import { getSpacing, TypoDS } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(15)

export const BookingDetailsContent = ({
  properties,
  booking,
}: {
  properties: BookingProperties
  booking: BookingReponse
}) => {
  const { address } = booking?.stock.offer ?? {}
  const offerFullAddress = address
    ? formatFullAddress(address.street, address.postalCode, address.city)
    : undefined

  const { offer } = booking.stock
  const shouldDisplayItineraryButton =
    !!offerFullAddress && (properties.isEvent || (properties.isPhysical && !properties.isDigital))

  const { hourLabel, dayLabel } = getBookingLabels(booking, properties)
  return (
    <TicketCutout
      hour={hourLabel == '' ? undefined : hourLabel}
      day={dayLabel == '' ? undefined : dayLabel}
      isDuo={properties.isDuo}
      venueInfo={
        <VenueBlockWithItinerary
          shouldDisplayItineraryButton={shouldDisplayItineraryButton}
          offerFullAddress={offerFullAddress}
          venue={getVenueBlockVenue(booking.stock.offer.venue)}
          address={getVenueBlockAddress(booking.stock.offer.address)}
          offerId={offer.id}
          thumbnailSize={VENUE_THUMBNAIL_SIZE}
        />
      }
      title={offer.name}
      infoBanner={
        <InfoBanner
          message="Tu auras besoin de ta carte d’identité pour accéder à l’évènement."
          icon={IdCard}
        />
      }>
      <TypoDS.Body>qrcode</TypoDS.Body>
    </TicketCutout>
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
