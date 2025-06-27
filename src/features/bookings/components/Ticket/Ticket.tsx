import { useNavigation } from '@react-navigation/native'
import React from 'react'

import {
  BookingOfferResponseAddress,
  BookingResponse,
  TicketResponse,
  UserProfileResponse,
} from 'api/gen'
import { TicketBottomPart } from 'features/bookings/components/Ticket/TicketBottomPart/TicketBottomPart'
import { TicketDisplay } from 'features/bookings/components/Ticket/TicketDisplay'
import { TicketTopPart } from 'features/bookings/components/Ticket/TicketTopPart'
import { getBookingLabelsV2 } from 'features/bookings/helpers'
import { formatEventDateLabel } from 'features/bookings/helpers/getBookingLabels'
import { BookingProperties } from 'features/bookings/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueBlockAddress } from 'features/offer/components/OfferVenueBlock/type'
import { VenueBlockWithItinerary } from 'features/offer/components/OfferVenueBlock/VenueBlockWithItinerary'
import { getAddress } from 'features/offer/helpers/getVenueBlockProps'
import { analytics } from 'libs/analytics/provider'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { IdCard } from 'ui/svg/icons/IdCard'
import { getSpacing } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(15)

type TicketProps = {
  properties: BookingProperties
  booking: BookingResponse
  mapping: SubcategoriesMapping
  user: UserProfileResponse
  display: 'punched' | 'full'
  setTopBlockHeight: React.Dispatch<React.SetStateAction<number>>
  ticket: TicketResponse
}

export const Ticket = ({
  properties,
  booking,
  mapping,
  setTopBlockHeight,
  user,
  display,
  ticket,
}: TicketProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { address } = booking?.stock.offer ?? {}

  const offerFullAddress = address
    ? formatFullAddress(address.street, address.postalCode, address.city)
    : undefined

  const { offer } = booking.stock

  const { hourLabel, dayLabel } = getBookingLabelsV2.getBookingLabels(booking, properties)

  const venueBlockAddress = getAddress(offer.address)

  const handleOnSeeVenuePress = () => {
    analytics.logConsultVenue({ venueId: offer.venue.id, from: 'bookings' })
    navigate('Venue', { id: offer.venue.id })
  }
  const expirationDateFormated = ({ prefix }: { prefix: string }) => {
    return booking.expirationDate
      ? formatEventDateLabel(booking.expirationDate, offer.venue.timezone, false, 'day', prefix)
      : undefined
  }
  return (
    <TicketDisplay
      onTopBlockLayout={setTopBlockHeight}
      display={display}
      topContent={
        <TicketTopPart
          day={dayLabel == '' ? undefined : dayLabel}
          hour={hourLabel == '' ? undefined : hourLabel}
          isDuo={properties.isDuo}
          ean={booking.stock.offer.extraData?.ean ?? undefined}
          expirationDate={expirationDateFormated({ prefix: 'À récupérer avant le ' })}
          title={offer.name}
          offer={offer}
          mapping={mapping}
          venueInfo={
            <VenueBlockWithItinerary
              properties={properties}
              offerFullAddress={offerFullAddress}
              venue={booking.stock.offer.venue}
              address={getVenueBlockAddress(booking.stock.offer.address)}
              offerId={offer.id}
              thumbnailSize={VENUE_THUMBNAIL_SIZE}
              addressLabel={venueBlockAddress?.label ?? undefined}
              onSeeVenuePress={offer.venue.isOpenToPublic ? handleOnSeeVenuePress : undefined}
            />
          }
        />
      }
      bottomContent={
        <TicketBottomPart
          isDuo={properties.isDuo ?? false}
          ticket={ticket}
          userEmail={user?.email}
          isDigital={properties.isDigital ?? false}
          isEvent={properties.isEvent ?? false}
          ean={booking.stock.offer.extraData?.ean ?? null}
        />
      }
      infoBanner={
        <InfoBanner
          message="Tu auras besoin de ta carte d’identité pour accéder à l’évènement."
          icon={IdCard}
        />
      }
    />
  )
}

const getVenueBlockAddress = (
  address: BookingOfferResponseAddress | null | undefined
): VenueBlockAddress | undefined => {
  return address ?? undefined
}
