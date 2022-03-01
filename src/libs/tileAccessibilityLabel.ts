import { t } from '@lingui/macro'

import { OfferTileProps } from 'features/offer/atoms/OfferTile'
import { parseTypeHomeLabel } from 'libs/parsers/venueType'
import { VenueHit } from 'libs/search'

type Offer = Pick<OfferTileProps, 'name' | 'categoryLabel' | 'price' | 'date' | 'distance'>
type Venue = Pick<VenueHit, 'name' | 'venueTypeCode'> & { distance?: string }
type TileContent = Offer | Venue
export enum TileContentType {
  OFFER = 'OFFER',
  VENUE = 'VENUE',
}

export function tileAccessibilityLabel(type: TileContentType, content: TileContent): string {
  const { distance, name } = content
  const nameLabel = name ? ` ${name}` : ''
  const distanceLabel = distance ? t`à` + ` ${distance},` : ''

  if (type === TileContentType.OFFER) {
    const { categoryLabel: category, date, price } = content as Offer
    const categoryLabel = category ? t`de la catégorie` + ` ${category},` : ''
    const datePrefix = date?.match(/^\d/) ? t`le` : ''
    const dateLabel = date ? datePrefix + ` ${date},` : ''
    const priceLabel = price === t`Gratuit` ? price : t`prix` + ` ${price}`
    return t`Offre` + `${nameLabel} ${categoryLabel} ${distanceLabel} ${dateLabel} ${priceLabel}`
  }
  if (type === TileContentType.VENUE) {
    const { venueTypeCode } = content as Venue
    const venueTypeLabel = parseTypeHomeLabel(venueTypeCode)
    const typeLabel = t`du type` + ` ${venueTypeLabel},`
    return t`Lieu` + `${nameLabel} ${typeLabel} ${distanceLabel}`
  }
  return ''
}
