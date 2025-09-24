import { OffersStocksResponseV2 } from 'api/gen'
import { convertOfferDatesToTimezone } from 'queries/offer/selectors/convertOfferDatesToTimezone'

export const convertOffererDatesToTimezone = (
  data: OffersStocksResponseV2
): OffersStocksResponseV2 => ({
  ...data,
  offers: data.offers.map((offer) => convertOfferDatesToTimezone(offer)),
})
