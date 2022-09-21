import { t } from '@lingui/macro'

import { BookingProperties } from 'features/bookings/helpers/getBookingProperties'
import { OfferTileProps } from 'features/offer/atoms/OfferTile'
import { parseTypeHomeLabel } from 'libs/parsers/venueType'
import { VenueHit } from 'libs/search'

type Offer = Pick<
  OfferTileProps,
  'name' | 'categoryLabel' | 'price' | 'date' | 'distance' | 'isDuo'
>
type Venue = Pick<VenueHit, 'name' | 'venueTypeCode'> & { distance?: string }
type Booking = {
  name: string
  properties?: BookingProperties
  date?: string
  dateUsed?: string
  cancellationDate?: string
}
type TileContent = Offer | Venue | Booking
export enum TileContentType {
  OFFER = 'OFFER',
  VENUE = 'VENUE',
  BOOKING = 'BOOKING',
}

function getOfferAccessibilityLabel(offer: Offer) {
  const { name, categoryLabel: category, distance, date, price, isDuo } = offer
  const nameLabel = name ? ` ${name}` : ''
  const categoryLabel = category ? t`de la catégorie` + ` ${category},` : ''
  const distanceLabel = distance ? t`à` + ` ${distance},` : ''
  const datePrefix = date?.match(/^\d/) ? t`le` : ''
  const dateLabel = date ? datePrefix + ` ${date},` : ''
  const priceLabel = price === t`Gratuit` ? price : t`prix` + ` ${price}`
  const duoLabel = isDuo ? t`Possibilité de réserver 2 places.` : ''
  return (
    t`Offre` +
    `${nameLabel} ${categoryLabel} ${distanceLabel} ${dateLabel} ${priceLabel}. ${duoLabel}`
  )
}

function getVenueAccessibilityLabel(venue: Venue) {
  const { name, venueTypeCode, distance } = venue
  const nameLabel = name ? ` ${name}` : ''
  const venueTypeLabel = parseTypeHomeLabel(venueTypeCode)
  const typeLabel = t`du type` + ` ${venueTypeLabel},`
  const distanceLabel = distance ? t`à` + ` ${distance}` : ''
  return t`Lieu` + `${nameLabel} ${typeLabel} ${distanceLabel}`
}

function getBookingAccessibilityLabel(booking: Booking) {
  const { name, properties, date, dateUsed, cancellationDate } = booking
  const nameLabel = name ? ` ${name}` : ''
  const defaultBookingLabel = t`Réservation de l'offre`
  let bookingLabel = dateUsed ? t`Réservation utilisée de l'offre` : defaultBookingLabel
  bookingLabel = cancellationDate ? t`Réservation annulée de l'offre` : bookingLabel
  const datePrefix = properties?.isEvent ? t`pour` : ''
  const bookingDateLabel = date ? `${datePrefix} ${date}` : ''
  const ongoingBookingDateLabel = properties?.isPermanent ? t`permanente` : bookingDateLabel
  const usedBookingDateLabel =
    dateUsed || cancellationDate ? t`le` + ` ${dateUsed ?? cancellationDate}` : undefined
  return bookingLabel + `${nameLabel}, ${usedBookingDateLabel ?? ongoingBookingDateLabel}`
}

export function tileAccessibilityLabel(type: TileContentType, content: TileContent): string {
  switch (type) {
    case TileContentType.OFFER:
      return getOfferAccessibilityLabel(content as Offer)
    case TileContentType.VENUE:
      return getVenueAccessibilityLabel(content as Venue)
    case TileContentType.BOOKING:
      return getBookingAccessibilityLabel(content as Booking)
    default:
      return ''
  }
}
