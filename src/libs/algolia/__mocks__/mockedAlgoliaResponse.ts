import { SearchResponse } from '@algolia/client-search'

import { SubcategoryIdEnum } from 'api/gen'
import { Offer } from 'libs/algolia'

export const mockedAlgoliaResponse: SearchResponse<Offer> = {
  hits: [
    {
      offer: {
        dates: [],
        isDigital: false,
        isDuo: false,
        name: 'La nuit des temps',
        prices: [28.0],
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDNQ',
      },
      _geoloc: { lat: 48.94374, lng: 2.48171 },
      objectID: '102280',
    },
    {
      offer: {
        dates: [],
        isDigital: false,
        isDuo: false,
        name: 'I want something more',
        prices: [23.0],
        subcategoryId: SubcategoryIdEnum.CONCERT,
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDKQ',
      },
      _geoloc: { lat: 48.91265, lng: 2.4513 },
      objectID: '102272',
    },
    {
      offer: {
        dates: [1605643200.0],
        isDigital: false,
        isDuo: true,
        name: 'Un lit sous une rivière',
        prices: [34.0],
        subcategoryId: SubcategoryIdEnum.CONCERT,
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDBA',
      },
      _geoloc: { lat: 4.90339, lng: -52.31663 },
      objectID: '102249',
    },
    {
      offer: {
        dates: [],
        isDigital: false,
        isDuo: false,
        name: 'I want something more',
        prices: [28.0],
        subcategoryId: SubcategoryIdEnum.CONCERT,
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

export const moreHitsForSimilarOffersPlaylist = [
  {
    offer: {
      dates: [],
      isDigital: false,
      isDuo: false,
      name: 'La nuit de tous les temps',
      prices: [28.0],
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      thumbUrl:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDNQ',
    },
    _geoloc: { lat: 48.94374, lng: 2.48171 },
    objectID: '102281',
  },
  {
    offer: {
      dates: [],
      isDigital: false,
      isDuo: false,
      name: 'I want something more and more',
      prices: [23.0],
      subcategoryId: SubcategoryIdEnum.CONCERT,
      thumbUrl:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDKQ',
    },
    _geoloc: { lat: 48.91265, lng: 2.4513 },
    objectID: '102273',
  },
  {
    offer: {
      dates: [1605643200.0],
      isDigital: false,
      isDuo: true,
      name: 'Un lit sous une rivière pourpre',
      prices: [34.0],
      subcategoryId: SubcategoryIdEnum.CONCERT,
      thumbUrl:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDBA',
    },
    _geoloc: { lat: 4.90339, lng: -52.31663 },
    objectID: '102250',
  },
  {
    offer: {
      dates: [],
      isDigital: false,
      isDuo: false,
      name: 'I want something more and more',
      prices: [28.0],
      subcategoryId: SubcategoryIdEnum.CONCERT,
      thumbUrl:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDZQ',
    },
    _geoloc: { lat: 4.90339, lng: -52.31663 },
    objectID: '102311',
  },
]
