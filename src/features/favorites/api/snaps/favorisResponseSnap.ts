import {
  ExpenseDomain,
  FavoriteCategoryResponse,
  FavoriteResponse,
  PaginatedFavoritesResponse,
} from 'api/gen'

// humanizedId AHD3A
export const paginatedFavoritesResponseSnap: PaginatedFavoritesResponse = {
  page: 1,
  nbFavorites: 4,
  favorites: [
    {
      id: 380,
      offer: {
        id: 146193,
        name: 'Spectacle une seule date',
        category: {
          categoryType: 'Event',
          label: 'Spectacle',
          name: 'SPECTACLE',
        } as FavoriteCategoryResponse,
        expenseDomains: [ExpenseDomain.All],
        externalTicketOfficeUrl: null,
        image: null,
        coordinates: {
          latitude: 48.12108,
          longitude: -1.17896,
        },
        price: 0,
        startPrice: null,
        date: new Date('2021-03-28T15:45:00'),
        startDate: null,
      },
    },
    {
      id: 381,
      offer: {
        id: 146112,
        name: 'Je ne sais pas ce que je dis',
        category: {
          categoryType: 'Event',
          label: 'Pratique artistique',
          name: 'LECON',
        } as FavoriteCategoryResponse,
        expenseDomains: [ExpenseDomain.All],
        externalTicketOfficeUrl: null,
        image: {
          credit: null,
          url:
            'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CW8Q',
        },
        coordinates: {
          latitude: 5.15839,
          longitude: -52.63741,
        },
        price: null,
        startPrice: 2400,
        date: null,
        startDate: new Date('2021-03-02T20:00:00'),
      },
    },
    {
      id: 389,
      offer: {
        id: 146099,
        name: 'Un lit sous une rivière',
        category: {
          categoryType: 'Event',
          label: 'Spectacle',
          name: 'SPECTACLE',
        } as FavoriteCategoryResponse,
        expenseDomains: [ExpenseDomain.All],
        externalTicketOfficeUrl: null,
        image: {
          credit: null,
          url:
            'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CWJQ',
        },
        coordinates: {
          latitude: 48.94538,
          longitude: 2.5029,
        },
        price: null,
        startPrice: 2700,
        date: null,
        startDate: new Date('2021-03-04T20:00:00'),
      },
    },
    {
      id: 393,
      offer: {
        id: 146105,
        name: 'Un lit sous une rivière',
        category: {
          categoryType: 'Event',
          label: 'Pratique artistique',
          name: 'LECON',
        } as FavoriteCategoryResponse,
        expenseDomains: [ExpenseDomain.All],
        externalTicketOfficeUrl: null,
        image: {
          credit: null,
          url:
            'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CWMA',
        },
        coordinates: {
          latitude: 48.9263,
          longitude: 2.49008,
        },
        price: null,
        startPrice: 2700,
        date: null,
        startDate: new Date('2021-03-04T20:00:00'),
      },
    },
  ],
}

export const addFavoriteJsonResponseSnap: FavoriteResponse = {
  id: 1000,
  offer: {
    id: 10000,
    name: 'Spectacle de test',
    category: {
      categoryType: 'Event',
      label: 'Spectacle',
      name: 'SPECTACLE',
    } as FavoriteCategoryResponse,
    expenseDomains: [ExpenseDomain.All],
    externalTicketOfficeUrl: null,
    image: null,
    coordinates: {
      latitude: 48.12108,
      longitude: -1.17896,
    },
    price: 0,
    startPrice: null,
    date: new Date('2021-04-01T12:00:00'),
    startDate: null,
  },
}
