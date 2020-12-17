import { CategoryNameEnum, CategoryType, OfferResponse } from 'api/gen'

// humanizedId AHD3A
export const offerResponseSnap: OfferResponse = {
  id: 116656,
  description:
    'Depuis de nombreuses années, Christine vit sous un pont, isolée de toute famille et amis. Par une nuit comme il n’en existe que dans les contes, un jeune garçon de 8 ans fait irruption devant son abri. Suli ne parle pas français, il est perdu, séparé de sa mère…\nTous les détails du film sur AlloCiné: http://www.allocine.fr/film/fichefilm_gen_cfilm=199293.html',
  isDigital: false,
  isDuo: true,
  name: 'Sous les étoiles de Paris - VF',
  category: { label: 'Cinéma', categoryType: CategoryType.Event, name: CategoryNameEnum.CINEMA },
  bookableStocks: [
    { id: 118929, beginningDatetime: new Date('2021-01-04T13:30:00'), price: 5 },
    { id: 118928, beginningDatetime: new Date('2021-01-03T18:00:00'), price: 5 },
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
  withdrawalDetails: undefined,
}

// humanizedId AGH2M
export const offerDuoReponseSnap: OfferResponse = {
  id: 102310,
  description:
    "D'un coup d'épée, Frappé par un héros, tomber la pointe au coeur! Oui, je disais cela!... Le destin est railleur!... Et voila que je suis tué, par un laquais, d'un coup de bûche! C'est très bien. J'aurai tout manqué, même ma mort.",
  isDigital: false,
  isDuo: true,
  name: 'I want something more',
  category: {
    label: 'Abonnements concerts',
    categoryType: CategoryType.Event,
    name: CategoryNameEnum.MUSIQUE,
  },
  bookableStocks: [
    { id: 118929, beginningDatetime: new Date('2021-01-04T13:30:00'), price: 5 },
    { id: 118928, beginningDatetime: new Date('2021-01-03T18:00:00'), price: 5 },
  ],
  imageUrl:
    'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDZQ',
  venue: {
    id: 1614,
    address: 'RUE DES MORPHOS',
    city: 'Cayenne',
    offerer: { name: 'Théâtre Balboa' },
    name: 'Espace des Gnoux',
    postalCode: '97300',
    publicName: undefined,
    coordinates: { latitude: 50.9, longitude: 2.4 },
  },
  withdrawalDetails: undefined,
}

// humanizedId AGH2K
export const offerDigitalResponseSnap: OfferResponse = {
  id: 102309,
  description:
    'Ainsi la personne avec qui elle avait confessé qu’elle allait goûter, avec qui elle vous avait supplié de la laisser goûter, cette personne, raison avouée par la nécessité, ce n’était pas elle, c’était une autre, c’était encore autre chose ! Autre chose, quoi ? Une autre, qui ?',
  isDigital: true,
  isDuo: false,
  name: 'Dormons peu soupons bien',
  category: {
    label: 'Livre ou carte lecture',
    categoryType: CategoryType.Thing,
    name: CategoryNameEnum.LIVRE,
  },
  bookableStocks: [],
  imageUrl:
    'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDZA',
  venue: {
    id: 1614,
    address: 'RUE DES MORPHOS',
    city: 'Cayenne',
    offerer: { name: 'Théâtre Balboa' },
    name: 'Espace des Gnoux',
    postalCode: '97300',
    publicName: undefined,
    coordinates: { latitude: 48.86673, longitude: 2.32294 },
  },
  withdrawalDetails: undefined,
}
