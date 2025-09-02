import { HeadlineOfferData } from 'features/headlineOffer/type'
import { Position } from 'libs/location/location'
import { formatDistance } from 'libs/parsers/formatDistance'
import {
  formatStartPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { Offer } from 'shared/offer/types'

type OfferToHeadlineOfferData = {
  mapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping
  currency: Currency
  euroToPacificFrancRate: number
  userLocation?: Position
}

type OfferToHeadlineParams = {
  offer?: Offer
  transformParameters: OfferToHeadlineOfferData
}

export function offerToHeadlineOfferData({
  offer,
  transformParameters,
}: OfferToHeadlineParams): HeadlineOfferData | null {
  if (!offer) return null

  const { offer: hitOffer, objectID, _geoloc } = offer
  const { mapping, labelMapping, currency, euroToPacificFrancRate, userLocation } =
    transformParameters

  const displayedPrice = getDisplayedPrice(
    hitOffer.prices,
    currency,
    euroToPacificFrancRate,
    getIfPricesShouldBeFixed(hitOffer.subcategoryId) ? formatStartPrice : undefined
  )

  return {
    id: objectID,
    offerTitle: hitOffer.name,
    imageUrl: hitOffer.thumbUrl ?? '',
    categoryId: mapping[hitOffer.subcategoryId],
    category: labelMapping[hitOffer.subcategoryId] ?? '',
    price: displayedPrice,
    distance: formatDistance({ lat: _geoloc?.lat, lng: _geoloc?.lng }, userLocation),
  }
}
