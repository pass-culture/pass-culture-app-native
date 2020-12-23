import { CategoryNameEnum, CategoryType, OfferResponse } from 'api/gen'

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
    'Depuis de nombreuses années, Christine vit sous un pont, isolée de toute famille et amis. Par une nuit comme il n’en existe que dans les contes, un jeune garçon de 8 ans fait irruption devant son abri. Suli ne parle pas français, il est perdu, séparé de sa mère…\nTous les détails du film sur AlloCiné: http://www.allocine.fr/film/fichefilm_gen_cfilm=199293.html',
  isDigital: false,
  isDuo: true,
  name: 'Sous les étoiles de Paris - VF',
  category: { label: 'Cinéma', categoryType: CategoryType.Event, name: CategoryNameEnum.CINEMA },
  stocks: [
    { id: 118929, beginningDatetime: new Date('2021-01-04T13:30:00'), price: 5, isBookable: true },
    { id: 118928, beginningDatetime: new Date('2021-01-03T18:00:00'), price: 5, isBookable: true },
  ],
  imageUrl:
    'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/products/CHSYS',
  venue: {
    id: 1664,
    address: '2 RUE LAMENNAIS',
    city: 'PARIS 8',
    offerer: { name: 'PATHE BEAUGRENELLE' },
    name: 'PATHE BEAUGRENELLE',
    postalCode: '75008',
    publicName: undefined,
    coordinates: { latitude: 20, longitude: 2 },
  },
  withdrawalDetails: 'How to withdraw, https://test.com',
}

export const offerAdaptedResponseSnap = {
  ...offerResponseSnap,
  fullAddress: 'PATHE BEAUGRENELLE, 2 RUE LAMENNAIS, 75008 PARIS 8',
}
