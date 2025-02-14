import React from 'react'

import { TicketCutout } from 'features/bookings/components/TicketCutout'
import { getBookingLabels, getBookingProperties } from 'features/bookings/helpers'
import { Booking } from 'features/bookings/types'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { useSubcategoriesMapping } from 'libs/subcategories'

export const NewBookingPage = ({ booking }: { booking: Booking }) => {
  const { offer } = booking.stock
  const { address, venue } = offer
  const offerFullAddress = address
    ? formatFullAddress(address.street, address.postalCode, address.city)
    : undefined

  const mapping = useSubcategoriesMapping()
  const properties = getBookingProperties(booking, mapping[offer.subcategoryId].isEvent)
  const shouldDisplayItineraryButton =
    !!offerFullAddress && (properties.isEvent || (properties.isPhysical && !properties.isDigital))

  const propertiesLabels = getBookingLabels(booking, properties)

  // si billet -> 'Présente ce billet pour accéder à l'évènement'
  // si pas de billet -> Tu n’as pas besoin de billet pour profiter de cette offre !
  return (
    <TicketCutout
      venue={venue}
      address={address}
      hour={propertiesLabels.dateLabel}
      day={propertiesLabels.dateLabel}
      isDuo={properties.isDuo}
      shouldDisplayItineraryButton={shouldDisplayItineraryButton}
      offerFullAddress={offerFullAddress}
      offerId={offer.id}
      title={offer.name}
      infoBanner={}
      children={<React.Fragment />}
    />
  )
}
