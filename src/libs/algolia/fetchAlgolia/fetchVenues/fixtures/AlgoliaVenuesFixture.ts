import { VenueTypeCodeKey } from 'api/gen'
import { AlgoliaVenue } from 'libs/algolia/types'

export const algoliaVenuesFixture: AlgoliaVenue[] = [
  {
    audio_disability: false,
    banner_url: null,
    city: 'Paris',
    postalCode: '75000',
    description: 'Focus campaign accept save both each.',
    email: 'contact@venue.com',
    facebook: null,

    instagram: 'http://instagram.com/@venue',

    mental_disability: false,
    motor_disability: false,
    name: 'Cinéma de la fin',
    objectID: '4197',
    offerer_name: 'Lieu non dit',
    phone_number: '+33102030405',
    snapchat: null,

    twitter: null,
    venue_type: VenueTypeCodeKey.VISUAL_ARTS,
    visual_disability: false,
    website: 'https://my.website.com',
    _geoloc: { lat: 48.871728, lng: 2.308157 },
  },
  {
    _geoloc: { lat: 48.871728, lng: 2.308157 },
    audio_disability: false,
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/venues/CBQA_1678748459',
    description: 'Heavy fund reason college body hand.',
    email: 'contact@venue.com',
    facebook: null,
    city: '',
    postalCode: '',
    instagram: 'http://instagram.com/@venue',
    mental_disability: false,
    motor_disability: false,
    name: 'La librairie quantique',
    objectID: '4192',
    offerer_name: 'Syndicat des librairies physiques',
    phone_number: '+33102030405',
    snapchat: null,
    twitter: null,
    venue_type: VenueTypeCodeKey.VISUAL_ARTS,
    visual_disability: false,
    website: 'https://my.website.com',
  },
]
