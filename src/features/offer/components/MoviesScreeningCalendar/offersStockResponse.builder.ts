import { OfferResponseV2, OfferStockResponse } from 'api/gen'
import {
  createBuilder,
  createDateBuilder,
} from 'features/offer/components/MoviesScreeningCalendar/createBuilder'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'

const defaultOfferResponse = offersStocksResponseSnap.offers[0]
const defaultStock = defaultOfferResponse.stocks[0]

export const offerResponseBuilder = createBuilder<OfferResponseV2>(defaultOfferResponse)
export const stockBuilder = createBuilder<OfferStockResponse>(defaultStock)
export const dateBuilder = createDateBuilder()
