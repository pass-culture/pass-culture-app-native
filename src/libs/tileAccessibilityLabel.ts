import { t } from '@lingui/macro'

import { BookingProperties } from 'features/bookings/helpers'
import { OfferTileProps } from 'features/offer/atoms/OfferTile'
import { parseTypeHomeLabel } from 'libs/parsers/venueType'
import { VenueHit } from 'libs/search'

type Offer = Pick<OfferTileProps, 'name' | 'categoryLabel' | 'price' | 'date' | 'distance'>
type Venue = Pick<VenueHit, 'name' | 'venueTypeCode'> & { distance?: string }
type Booking = {
  name: string
  properties?: BookingProperties
  date?: string
  dateUsed?: string
  cancellationDate?: string
  cancellationReason?: string
}
type TileContent = Offer | Venue | Booking
export enum TileContentType {
  OFFER = 'OFFER',
  VENUE = 'VENUE',
  BOOKING = 'BOOKING',
}

export function tileAccessibilityLabel(type: TileContentType, content: TileContent): string {
  const { name } = content
  const nameLabel = name ? ` ${name}` : ''

  if (type === TileContentType.OFFER) {
    const { categoryLabel: category, distance, date, price } = content as Offer
    const categoryLabel = category ? t`de la catégorie` + ` ${category},` : ''
    const distanceLabel = distance ? t`à` + ` ${distance},` : ''
    const datePrefix = date?.match(/^\d/) ? t`le` : ''
    const dateLabel = date ? datePrefix + ` ${date},` : ''
    const priceLabel = price === t`Gratuit` ? price : t`prix` + ` ${price}`
    return t`Offre` + `${nameLabel} ${categoryLabel} ${distanceLabel} ${dateLabel} ${priceLabel}`
  }
  if (type === TileContentType.VENUE) {
    const { venueTypeCode, distance } = content as Venue
    const venueTypeLabel = parseTypeHomeLabel(venueTypeCode)
    const typeLabel = t`du type` + ` ${venueTypeLabel},`
    const distanceLabel = distance ? t`à` + ` ${distance}` : ''
    return t`Lieu` + `${nameLabel} ${typeLabel} ${distanceLabel}`
  }
  if (type === TileContentType.BOOKING) {
    const { properties, date, dateUsed, cancellationDate, cancellationReason } = content as Booking
    let bookingLabel = t`Réservation de l'offre`
    if (dateUsed || cancellationReason) {
      bookingLabel = dateUsed
        ? t`Réservation utilisée de l'offre`
        : t`Réservation annulée de l'offre`
    }
    const datePrefix = properties?.isEvent ? t`pour` : ''
    const ongoingBookingDateLabel = properties?.isPermanent
      ? t`permanente`
      : date
      ? `${datePrefix} ${date}`
      : ''
    const usedBookingDateLabel =
      dateUsed || cancellationDate ? t`le` + ` ${dateUsed ?? cancellationDate}` : undefined
    return bookingLabel + `${nameLabel}, ${usedBookingDateLabel ?? ongoingBookingDateLabel}`
  }
  return ''
}
