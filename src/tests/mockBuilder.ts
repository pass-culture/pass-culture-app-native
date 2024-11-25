import { SearchResponse } from '@algolia/client-search'
import { mergeWith } from 'lodash'

import { OfferResponseV2, OfferStockResponse, OfferVenueResponse, SubcategoryIdEnum } from 'api/gen'
import { createDateBuilder } from 'features/offer/components/MoviesScreeningCalendar/createBuilder'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { Offer } from 'shared/offer/types'

type PartialDeepWithArrays<T> =
  T extends Array<infer U>
    ? Array<PartialDeepWithArrays<U>>
    : T extends object
      ? { [K in keyof T]?: PartialDeepWithArrays<T[K]> }
      : T

const createMockBuilder = <T>(defaultMock: T) => {
  return (param: PartialDeepWithArrays<T>) => {
    const mergedObj = mergeWith({}, defaultMock, param, customizer)
    return mergedObj as T
  }
}

const customizer = <T>(objValue: T, srcValue: unknown) => {
  if (Array.isArray(objValue)) {
    return srcValue
  }
  return
}

const defaultOfferResponse = offersStocksResponseSnap.offers[0]
const defaultStock = defaultOfferResponse.stocks[0]
const searchResponseOffer = {
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
}

export const mockBuilder = {
  offerResponseV2: createMockBuilder<OfferResponseV2>(defaultOfferResponse),
  offerVenueResponse: createMockBuilder<OfferVenueResponse>(defaultOfferResponse.venue),
  offerStockResponse: createMockBuilder<OfferStockResponse>(defaultStock),
  searchResponseOffer: createMockBuilder<SearchResponse<Offer>>(searchResponseOffer),
}

export const dateBuilder = createDateBuilder()
