import { SearchResponse } from '@algolia/client-search'

import { CategoryNameEnum } from 'api/gen'

import { AlgoliaHit } from '..'

export const mockedAlgoliaResponse: SearchResponse<AlgoliaHit> = {
  hits: [
    {
      offer: {
        category: CategoryNameEnum.MUSIQUE,
        dates: [],
        isDigital: false,
        isDuo: false,
        name: 'Mensch ! Où sont les Hommes ?',
        prices: [28.0],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDNQ',
      },
      _geoloc: { lat: 48.94374, lng: 2.48171 },
      objectID: '102280',
    },
    {
      offer: {
        category: CategoryNameEnum.MUSIQUE,
        dates: [],
        isDigital: false,
        isDuo: false,
        name: 'I want something more',
        prices: [23.0],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDKQ',
      },
      _geoloc: { lat: 48.91265, lng: 2.4513 },
      objectID: '102272',
    },
    {
      offer: {
        category: CategoryNameEnum.MUSIQUE,
        dates: [1605643200.0],
        isDigital: false,
        isDuo: true,
        name: 'Un lit sous une rivière',
        prices: [34.0],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDBA',
      },
      _geoloc: { lat: 4.90339, lng: -52.31663 },
      objectID: '102249',
    },
    {
      offer: {
        category: CategoryNameEnum.MUSIQUE,
        dates: [],
        isDigital: false,
        isDuo: false,
        name: 'I want something more',
        prices: [28.0],
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDZQ',
      },
      _geoloc: { lat: 4.90339, lng: -52.31663 },
      objectID: '102310',
    },
  ],
  nbHits: 4,
  page: 0,
  nbPages: 1,
  hitsPerPage: 6,
  exhaustiveNbHits: true,
  query: '',
  params:
    'page=0&facetFilters=%5B%5B%22offer.category%3AMUSIQUE%22%2C%22offer.category%3AINSTRUMENT%22%5D%5D&numericFilters=%5B%5B%22offer.prices%3A+0+TO+300%22%5D%5D&hitsPerPage=6',
  processingTimeMS: 1,
}

export const physicalAlgoliaOffer: AlgoliaHit = {
  offer: {
    category: CategoryNameEnum.SPECTACLE,
    dates: [1612465203, 1612551603, 1612638003],
    isDigital: false,
    isDuo: true,
    name: 'Mad in Finland',
    prices: [9, 9, 9],
    thumbUrl:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/ZEWA',
  },
  _geoloc: { lat: 48.51381, lng: -2.76138 },
  objectID: '3503086',
}

export const digitalAlgoliaOffer: AlgoliaHit = {
  offer: {
    category: CategoryNameEnum.FILM,
    dates: [],
    isDigital: true,
    isDuo: false,
    name: 'Web série : Simone et moi',
    prices: [0],
    thumbUrl:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/5AZQ',
  },
  _geoloc: { lat: 47.158459, lng: 2.409289 },
  objectID: '5914536',
}

export const freeNotDuoAlgoliaOffer: AlgoliaHit = digitalAlgoliaOffer

export const noPriceNotDuoAlgoliaOffer: AlgoliaHit = {
  ...freeNotDuoAlgoliaOffer,
  offer: {
    ...freeNotDuoAlgoliaOffer.offer,
    prices: [],
  },
}

export const sevenEuroNotDuoAlgoliaOffer: AlgoliaHit = {
  ...freeNotDuoAlgoliaOffer,
  offer: {
    ...freeNotDuoAlgoliaOffer.offer,
    prices: [7],
  },
}
