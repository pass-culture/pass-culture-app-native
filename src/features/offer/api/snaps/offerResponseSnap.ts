import { ExpenseDomain, OfferResponse, SubcategoryIdEnum } from 'api/gen'

// humanizedId AHD3A
export const offerResponseSnap: OfferResponse = {
  id: 116656,
  accessibility: {
    audioDisability: true,
    mentalDisability: true,
    motorDisability: false,
    visualDisability: false,
  },
  description:
    'Depuis de nombreuses années, Christine vit sous un pont, isolée de toute famille et amis. Par une nuit comme il n’en existe que dans les contes, un jeune garçon de 8 ans fait irruption devant son abri. Suli ne parle pas français, il est perdu, séparé de sa mère…\nTous les détails du film sur AlloCiné: https://www.allocine.fr/film/fichefilm_gen_cfilm=199293.html',
  expenseDomains: [ExpenseDomain.all],
  isDigital: false,
  isDuo: true,
  isEducational: false,
  name: 'Sous les étoiles de Paris - VF',
  subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
  isReleased: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  stocks: [
    {
      id: 118929,
      beginningDatetime: '2021-01-04T13:30:00',
      price: 500,
      isBookable: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
    },
    {
      id: 118928,
      beginningDatetime: '2021-01-03T18:00:00',
      price: 500,
      isBookable: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
    },
  ],
  image: {
    url: 'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/products/CHSYS',
    credit: 'Author: photo credit author',
  },
  venue: {
    id: 1664,
    address: '2 RUE LAMENNAIS',
    city: 'PARIS 8',
    offerer: { name: 'PATHE BEAUGRENELLE' },
    name: 'PATHE BEAUGRENELLE',
    postalCode: '75008',
    publicName: undefined,
    coordinates: { latitude: 20, longitude: 2 },
    isPermanent: true,
  },
  withdrawalDetails: 'How to withdraw, https://test.com',
}
