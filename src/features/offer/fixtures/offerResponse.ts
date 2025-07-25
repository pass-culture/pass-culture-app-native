import type { ReadonlyDeep } from 'type-fest'

import { ExpenseDomain, OfferResponseV2, SubcategoryIdEnum } from 'api/gen'
import { toMutable } from 'shared/types/toMutable'

// humanizedId AHD3A
export const offerResponseSnap = toMutable({
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
  isHeadline: false,
  reactionsCount: {
    likes: 1,
  },
  address: {
    label: 'PATHE BEAUGRENELLE',
    city: 'PARIS 8',
    postalCode: '75008',
    coordinates: {
      latitude: 0.1,
      longitude: 0.1,
    },
    street: '2 RUE LAMENNAIS',
    timezone: 'Europe/Paris',
  },
  chronicles: [
    {
      id: 1,
      contentPreview: 'Le Voyage Extraordinaire',
      dateCreated: '2025-01-20T23:32:13.978038Z',
      author: {
        firstName: 'John',
        age: 14,
      },
    },
    {
      id: 2,
      contentPreview: 'L’Art de la Cuisine',
      dateCreated: '2025-02-20T23:32:13.978038Z',
      author: {
        firstName: 'Bob',
        age: 12,
      },
    },
    {
      id: 3,
      contentPreview: 'Le Futur de la Technologie',
      dateCreated: '2025-03-20T23:32:13.978038Z',
      author: null,
    },
  ],
  stocks: [
    {
      id: 118929,
      beginningDatetime: '2021-01-04T13:30:00',
      price: 500,
      isBookable: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      features: [],
    },
    {
      id: 118928,
      beginningDatetime: '2021-01-03T18:00:00',
      price: 500,
      isBookable: true,
      isExpired: false,
      isForbiddenToUnderage: false,
      isSoldOut: false,
      features: [],
    },
  ],
  images: {
    recto: {
      url: 'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/products/CHSYS',
      credit: 'Author: photo credit author',
    },
  },
  venue: {
    id: 1664,
    address: '2 RUE LAMENNAIS',
    bannerUrl:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
    city: 'PARIS 8',
    offerer: { name: 'PATHE BEAUGRENELLE' },
    name: 'PATHE BEAUGRENELLE',
    postalCode: '75008',
    publicName: undefined,
    coordinates: { latitude: 20, longitude: 2 },
    isPermanent: true,
    isOpenToPublic: true,
    timezone: 'Europe/Paris',
  },
  withdrawalDetails: 'How to withdraw, https://test.com',
  metadata: {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Sous les étoiles de Paris - VF',
    description:
      'Depuis de nombreuses années, Christine vit sous un pont, isolée de toute famille et amis. Par une nuit comme il n’en existe que dans les contes, un jeune garçon de 8 ans fait irruption devant son abri. Suli ne parle pas français, il est perdu, séparé de sa mère…\nTous les détails du film sur AlloCiné: https://www.allocine.fr/film/fichefilm_gen_cfilm=199293.html',
    image:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/products/CHSYS',
    location: {
      '@type': 'Place',
      name: 'PATHE BEAUGRENELLE',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '2 RUE LAMENNAIS',
        postalCode: '75008',
        addressLocality: 'PARIS 8',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 20, longitude: 2 },
    },
  },
  isExternalBookingsDisabled: false,
  artists: [],
  videoUrl: 'https://www.youtube.com/watch?v=hWdLhB2okqA',
} as const satisfies ReadonlyDeep<OfferResponseV2>)
