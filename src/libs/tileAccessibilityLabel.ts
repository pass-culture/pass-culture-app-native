import { BookingProperties } from 'features/bookings/types'
import { OfferTileProps } from 'features/offer/types'
import { VenueHit } from 'libs/algolia/types'
import { parseActivity } from 'libs/parsers/activity'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'

type Offer = Pick<OfferTileProps, 'name' | 'categoryLabel' | 'price' | 'date' | 'isDuo'> & {
  distance?: string
  interactionTagLabel?: string
}
type Venue = Pick<VenueHit, 'name' | 'activity' | 'city' | 'postalCode'> & { distance?: string }
type Booking = {
  name: string
  properties?: BookingProperties
  date?: string
  dateUsed?: string
  cancellationDate?: string
  venueName?: string
}
type TileContent = Offer | Venue | Booking
export enum TileContentType {
  OFFER = 'OFFER',
  VENUE = 'VENUE',
  BOOKING = 'BOOKING',
}

function getOfferAccessibilityLabel(offer: Offer) {
  const { name, categoryLabel: category, distance, date, price, isDuo, interactionTagLabel } = offer
  const duoLabel = isDuo ? 'Duo - Possibilité de réserver 2 places.' : undefined
  return getComputedAccessibilityLabel(
    category,
    interactionTagLabel,
    name,
    distance,
    price,
    date,
    duoLabel
  )
}

function getVenueAccessibilityLabel(venue: Venue) {
  const { name, activity, distance, city, postalCode } = venue
  const activityLabel = parseActivity(activity)
  return getComputedAccessibilityLabel(name, distance, city, postalCode, activityLabel)
}

function getBookingAccessibilityLabel(booking: Booking) {
  const { name, properties, date, dateUsed, cancellationDate, venueName } = booking
  const bookingStatus = cancellationDate
    ? 'Réservation annulée'
    : dateUsed
      ? 'Réservation utilisée'
      : 'Réservation en cours'
  const ongoingBookingDateLabel = properties?.isPermanent ? 'permanente' : date
  const labelDate = dateUsed ?? cancellationDate
  const usedBookingDateLabel = labelDate ? `le ${labelDate}` : undefined
  const bookingDate = usedBookingDateLabel ?? ongoingBookingDateLabel
  return getComputedAccessibilityLabel(bookingStatus, bookingDate, name, venueName)
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
