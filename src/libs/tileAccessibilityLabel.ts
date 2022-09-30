import { BookingProperties } from 'features/bookings/types'
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
  const nameLabel = name ?? ''
  const categoryLabel = category ? `de la catégorie ${category},` : ''
  const distanceLabel = distance ? `à ${distance},` : ''
  const datePrefix = date?.match(/^\d/) ? `le` : ''
  const dateLabel = date ? datePrefix + ` ${date},` : ''
  const priceLabel = price === 'Gratuit' ? price : `prix ${price}`
  const duoLabel = isDuo ? 'Possibilité de réserver 2 places.' : ''
  return `Offre ${nameLabel} ${categoryLabel} ${distanceLabel} ${dateLabel} ${priceLabel}. ${duoLabel}`
}

function getVenueAccessibilityLabel(venue: Venue) {
  const { name, venueTypeCode, distance } = venue
  const nameLabel = name ?? ''
  const venueTypeLabel = parseTypeHomeLabel(venueTypeCode)
  const typeLabel = `du type ${venueTypeLabel},`
  const distanceLabel = distance ? `à ${distance}` : ''
  return `Lieu ${nameLabel} ${typeLabel} ${distanceLabel}`
}

function getBookingAccessibilityLabel(booking: Booking) {
  const { name, properties, date, dateUsed, cancellationDate } = booking
  const nameLabel = name ?? ''
  const defaultBookingLabel = 'Réservation de l’offre'
  let bookingLabel = dateUsed ? 'Réservation utilisée de l’offre' : defaultBookingLabel
  bookingLabel = cancellationDate ? 'Réservation annulée de l’offre' : bookingLabel
  const datePrefix = properties?.isEvent ? 'pour' : ''
  const bookingDateLabel = date ? `${datePrefix} ${date}` : ''
  const ongoingBookingDateLabel = properties?.isPermanent ? 'permanente' : bookingDateLabel
  const usedBookingDateLabel =
    dateUsed || cancellationDate ? `le ${dateUsed ?? cancellationDate}` : undefined
  return bookingLabel + ` ${nameLabel}, ${usedBookingDateLabel ?? ongoingBookingDateLabel}`
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
