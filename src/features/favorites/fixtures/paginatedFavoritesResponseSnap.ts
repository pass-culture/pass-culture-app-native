import type { ReadonlyDeep } from 'type-fest'

import { ExpenseDomain, PaginatedFavoritesResponse, SubcategoryIdEnum } from 'api/gen'
import { toMutable } from 'shared/types/toMutable'

// humanizedId AHD3A
export const paginatedFavoritesResponseSnap = toMutable({
  page: 1,
  nbFavorites: 4,
  favorites: [
    {
      id: 380,
      offer: {
        id: 146193,
        name: 'Spectacle une seule date',
        expenseDomains: [ExpenseDomain.all],
        externalTicketOfficeUrl: null,
        image: null,
        coordinates: {
          latitude: 48.12108,
          longitude: -1.17896,
        },
        subcategoryId: SubcategoryIdEnum.SPECTACLE_ENREGISTRE,
        price: 0,
        startPrice: null,
        date: '2021-03-28T15:45:00',
        startDate: null,
        isReleased: true,
        venueName: 'Cinéma de la fin',
      },
    },
    {
      id: 381,
      offer: {
        id: 146112,
        name: 'Je ne sais pas ce que je dis',
        expenseDomains: [ExpenseDomain.all],
        externalTicketOfficeUrl: null,
        image: {
          credit: null,
          url: 'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CW8Q',
        },
        subcategoryId: SubcategoryIdEnum.CONFERENCE,
        coordinates: {
          latitude: 5.15839,
          longitude: -52.63741,
        },
        price: null,
        startPrice: 2400,
        date: null,
        startDate: '2021-03-02T20:00:00',
        isReleased: true,
        venueName: 'Cinéma de la fin',
      },
    },
    {
      id: 389,
      offer: {
        id: 146099,
        name: 'Un lit sous une rivière',
        expenseDomains: [ExpenseDomain.all],
        externalTicketOfficeUrl: null,
        image: {
          credit: null,
          url: 'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CWJQ',
        },
        subcategoryId: SubcategoryIdEnum.SPECTACLE_ENREGISTRE,
        coordinates: {
          latitude: 48.94538,
          longitude: 2.5029,
        },
        price: null,
        startPrice: 2700,
        date: null,
        startDate: '2021-03-04T20:00:00',
        isReleased: true,
        venueName: 'Cinéma de la fin',
      },
    },
    {
      id: 393,
      offer: {
        id: 146105,
        name: 'Un lit sous une rivière',
        expenseDomains: [ExpenseDomain.all],
        externalTicketOfficeUrl: null,
        image: {
          credit: null,
          url: 'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CWMA',
        },
        subcategoryId: SubcategoryIdEnum.SPECTACLE_ENREGISTRE,
        coordinates: {
          latitude: 48.9263,
          longitude: 2.49008,
        },
        price: null,
        startPrice: 2700,
        date: null,
        startDate: '2021-03-04T20:00:00',
        isReleased: true,
        venueName: 'Cinéma de la fin',
      },
    },
  ],
} as const satisfies ReadonlyDeep<PaginatedFavoritesResponse>)
