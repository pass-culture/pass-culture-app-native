import { SearchResponse } from '@algolia/client-search'

import { OfferResponseV2, OfferStockResponse, OfferVenueResponse, SubcategoryIdEnum } from 'api/gen'
import {
  createBuilder,
  createDateBuilder,
} from 'features/offer/components/MoviesScreeningCalendar/createBuilder'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { Offer } from 'shared/offer/types'

const defaultOfferResponse = offersStocksResponseSnap.offers[0]
const defaultStock = defaultOfferResponse.stocks[0]

export const offerResponseBuilder = createBuilder<OfferResponseV2>(defaultOfferResponse)
export const venueBuilder = createBuilder<OfferVenueResponse>(defaultOfferResponse.venue)
export const stockBuilder = createBuilder<OfferStockResponse>(defaultStock)
export const searchResponseOfferBuilder = createBuilder<SearchResponse<Offer>>({
  hits: [
    {
      offer: {
        name: 'Harry potter à l’école des sorciers',
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      },
      venue: {},
      _geoloc: {
        lat: 2,
        lng: 2,
      },
      objectID: '1',
    },
    {
      offer: {
        name: 'Harry potter et le prisonnier d’Azkhaban',
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      },
      venue: {},
      _geoloc: {
        lat: 2,
        lng: 2,
      },
      objectID: '2',
    },
  ],
  page: 0,
  nbPages: 1,
  nbHits: 2,
  hitsPerPage: 20,
  processingTimeMS: 1,
  exhaustiveNbHits: true,
  query: '',
  params: '',
})
export const dateBuilder = createDateBuilder()
