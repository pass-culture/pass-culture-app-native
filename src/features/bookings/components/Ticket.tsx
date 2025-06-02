import { useNavigation } from '@react-navigation/native'
import React from 'react'

import {
  BookingOfferResponseAddress,
  BookingReponse,
  BookingVenueResponse,
  UserProfileResponse,
} from 'api/gen'
import { TicketBottomPart } from 'features/bookings/components/Ticket/TicketBottomPart/TicketBottomPart'
import { TicketDisplay } from 'features/bookings/components/Ticket/TicketDisplay'
import { TicketTopPart } from 'features/bookings/components/Ticket/TicketTopPart'
import { getBookingLabels } from 'features/bookings/helpers'
import { BookingProperties } from 'features/bookings/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { VenueBlockWithItinerary } from 'features/offer/components/OfferVenueBlock/VenueBlockWithItinerary'
import { getAddress } from 'features/offer/helpers/getVenueBlockProps'
import { analytics } from 'libs/analytics/provider'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { IdCard } from 'ui/svg/icons/IdCard'
import { getSpacing } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(15)

export const Ticket = ({
  properties,
  booking,
  mapping,
  setTopBlockHeight,
  user,
}: {
  properties: BookingProperties
  booking: BookingReponse
  mapping: SubcategoriesMapping
  user: UserProfileResponse
  setTopBlockHeight: React.Dispatch<React.SetStateAction<number>>
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { address } = booking?.stock.offer ?? {}

  const offerFullAddress = address
    ? formatFullAddress(address.street, address.postalCode, address.city)
    : undefined

  const { offer } = booking.stock

  const { hourLabel, dayLabel } = getBookingLabels(booking, properties)

  const venueBlockAddress = getAddress(offer.address)

  const handleOnSeeVenuePress = () => {
    analytics.logConsultVenue({ venueId: offer.venue.id, from: 'bookings' })
    navigate('Venue', { id: offer.venue.id })
  }

  return (
    <TicketDisplay
      topContent={
        <TicketTopPart
          day={dayLabel == '' ? undefined : dayLabel}
          hour={hourLabel == '' ? undefined : hourLabel}
          isDuo={properties.isDuo}
          title={offer.name}
          offer={offer}
          mapping={mapping}
          venueInfo={
            <VenueBlockWithItinerary
              properties={properties}
              offerFullAddress={offerFullAddress}
              venue={getVenueBlockVenue(booking.stock.offer.venue)}
              address={getVenueBlockAddress(booking.stock.offer.address)}
              offerId={offer.id}
              thumbnailSize={VENUE_THUMBNAIL_SIZE}
              addressLabel={venueBlockAddress?.label ?? undefined}
              onSeeVenuePress={offer.venue.isOpenToPublic ? handleOnSeeVenuePress : undefined}
            />
          }
        />
      }
      bottomContent={<TicketBottomPart offer={offer} booking={booking} userEmail={user?.email} />}
      infoBanner={
        <InfoBanner
          message="Tu auras besoin de ta carte d’identité pour accéder à l’évènement."
          icon={IdCard}
        />
      }
      onTopBlockLayout={setTopBlockHeight}
    />
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
