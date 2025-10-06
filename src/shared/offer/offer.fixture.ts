import type { ReadonlyDeep } from 'type-fest'

import { SubcategoryIdEnum, VenueTypeCodeKey } from 'api/gen'
import { Offer } from 'shared/offer/types'
import { toMutable } from 'shared/types/toMutable'

export const offersFixture = toMutable([
  {
    offer: {
      dates: [],
      isDigital: false,
      isDuo: false,
      name: 'La nuit des temps',
      prices: [2800],
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      thumbUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDNQ',
    },
    _geoloc: { lat: 48.94374, lng: 2.48171 },
    objectID: '102280',
    venue: {
      id: 1,
      name: 'Lieu 1',
      publicName: 'Lieu 1',
      address: '1 rue de la paix',
      postalCode: '75000',
      city: 'Paris',
      venue_type: VenueTypeCodeKey.BOOKSTORE,
    },
    artists: [{ id: '1', name: 'Artist 1' }],
  },
  {
    offer: {
      dates: [],
      isDigital: false,
      isDuo: false,
      name: 'I want something more',
      prices: [2300],
      subcategoryId: SubcategoryIdEnum.CONCERT,
      thumbUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDKQ',
    },
    _geoloc: { lat: 48.91265, lng: 2.4513 },
    objectID: '102272',
    venue: {
      id: 2,
      name: 'Lieu 2',
      publicName: 'Lieu 2',
      address: '2 rue de la paix',
      postalCode: '75000',
      city: 'Paris',
      venue_type: VenueTypeCodeKey.CONCERT_HALL,
    },
    artists: [
      { id: '2', name: 'Artist 2' },
      { id: '3', name: 'Artist 3' },
    ],
  },
  {
    offer: {
      dates: [1605643200.0],
      isDigital: false,
      isDuo: true,
      name: 'Un lit sous une rivière',
      prices: [3400],
      subcategoryId: SubcategoryIdEnum.CONCERT,
      thumbUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDBA',
    },
    _geoloc: { lat: 4.90339, lng: -52.31663 },
    objectID: '102249',
    venue: {
      id: 3,
      name: 'Lieu 3',
      publicName: 'Lieu 3',
      address: '3 rue de la paix',
      postalCode: '75000',
      city: 'Paris',
      venue_type: VenueTypeCodeKey.CONCERT_HALL,
    },
  },
  {
    offer: {
      dates: [],
      isDigital: false,
      isDuo: false,
      name: 'I want something more',
      prices: [2800],
      subcategoryId: SubcategoryIdEnum.CONCERT,
      thumbUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
    },
    _geoloc: { lat: 4.90339, lng: -52.31663 },
    objectID: '102310',
    venue: {
      id: 4,
      name: 'Lieu 4',
      publicName: 'Lieu 4',
      address: '4 rue de la paix',
      postalCode: '75000',
      city: 'Paris',
    },
    artists: [
      { id: '4', name: 'Artist 4' },
      { id: '5', name: 'Artist 4' },
    ],
  },
] as const satisfies ReadonlyDeep<Offer[]>)
