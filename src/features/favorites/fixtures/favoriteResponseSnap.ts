import { ExpenseDomain, FavoriteResponse, SubcategoryIdEnum } from 'api/gen'

export const favoriteResponseSnap: FavoriteResponse = {
  id: 1000,
  offer: {
    coordinates: { latitude: 48.12108, longitude: -1.17896 },
    date: '2021-04-01T12:00:00',
    expenseDomains: [ExpenseDomain.all],
    externalTicketOfficeUrl: null,
    id: 10000,
    image: null,
    isReleased: true,
    name: 'Spectacle de test',
    price: 0,
    startDate: null,
    startPrice: null,
    subcategoryId: SubcategoryIdEnum.SPECTACLE_ENREGISTRE,
  },
}
