import { Position } from 'libs/location'
import { formatDistance } from 'libs/parsers/formatDistance'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { Offer } from 'shared/offer/types'

export type HeadlineOfferDataParams = {
  offer: Offer
  mapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping
  currency: Currency
  euroToPacificFrancRate: number
  userLocation?: Position
}

export function headlineOfferData({
  offer,
  mapping,
  labelMapping,
  currency,
  euroToPacificFrancRate,
  userLocation,
}: HeadlineOfferDataParams) {
  if (!offer) return
  const { offer: hitOffer, objectID, _geoloc } = offer
  if (!hitOffer.thumbUrl) return

  const displayedPrice = getDisplayedPrice(hitOffer.prices, currency, euroToPacificFrancRate)

  return {
    id: objectID,
    offerTitle: hitOffer.name,
    imageUrl: hitOffer.thumbUrl,
    categoryId: mapping[hitOffer.subcategoryId],
    category: labelMapping[hitOffer.subcategoryId] ?? '',
    price: displayedPrice,
    distance: _geoloc
      ? formatDistance({ lat: _geoloc?.lat, lng: _geoloc?.lng }, userLocation)
      : undefined,
  }
}
