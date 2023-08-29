import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { env } from 'libs/environment'

export const mockSuggestionHits = [
  {
    objectID: '1',
    query: 'cinéma',
    _highlightResult: {
      query: {
        value: '<mark>cinéma</mark>',
        matchLevel: 'full',
        fullyHighlighted: true,
        matchedWords: ['cinéma'],
      },
    },
    [env.ALGOLIA_OFFERS_INDEX_NAME]: {
      exact_nb_hits: 2,
      facets: {
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
              count: 10,
            },
          ],
          ['offer.nativeCategoryId']: [
            {
              attribute: '',
              operator: '',
              value: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
              count: 10,
            },
          ],
        },
      },
    },
  },
  {
    objectID: '2',
    query: 'cinéma itinérant',
    _highlightResult: {
      query: {
        value: '<mark>cinéma</mark> itinérant',
        matchLevel: 'full',
        fullyHighlighted: false,
        matchedWords: ['cinéma'],
      },
    },
    [env.ALGOLIA_OFFERS_INDEX_NAME]: {
      exact_nb_hits: 2,
      facets: {
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
              count: 10,
            },
          ],
          ['offer.nativeCategoryId']: [
            {
              attribute: '',
              operator: '',
              value: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
              count: 10,
            },
          ],
        },
      },
    },
  },
]

export const mockVenueHits = [
  {
    city: 'Quiberon',
    postalCode: '56270',
    name: 'cinéma le Paradis',
    offerer_name: 'COMMUNE DE QUIBERON',
    venue_type: 'MOVIE',
    description: '',
    audio_disability: false,
    mental_disability: false,
    motor_disability: true,
    visual_disability: false,
    email: null,
    phone_number: null,
    website: null,
    facebook: null,
    twitter: null,
    instagram: null,
    snapchat: null,
    tags: [],
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-staging-assets-fine-grained/assets/venue_default_images/denise-jans-OaVJQZ-nFD0-unsplash.png',
    _geoloc: {
      lat: 47.48635,
      lng: -3.11926,
    },
    has_at_least_one_bookable_offer: false,
    objectID: '9898',
    _highlightResult: {
      name: {
        value: '<mark>ciné</mark>ma le Paradis',
        matchLevel: 'full',
        fullyHighlighted: false,
        matchedWords: ['cine'],
      },
    },
  },
  {
    city: 'Tour-de-Faure',
    postalCode: '46330',
    name: 'Ciné-Lot TOUR DE FAURE',
    offerer_name: 'FEDERATION DEP DES FOYERS RURAUX DU LOT',
    venue_type: 'TRAVELING_CINEMA',
    description: '',
    audio_disability: false,
    mental_disability: false,
    motor_disability: false,
    visual_disability: false,
    email: null,
    phone_number: null,
    website: null,
    facebook: null,
    twitter: null,
    instagram: null,
    snapchat: null,
    tags: [],
    banner_url: null,
    _geoloc: {
      lat: 44.46932,
      lng: 1.68754,
    },
    has_at_least_one_bookable_offer: false,
    objectID: '9495',
    _highlightResult: {
      name: {
        value: '<mark>Ciné</mark>-Lot TOUR DE FAURE',
        matchLevel: 'full',
        fullyHighlighted: false,
        matchedWords: ['cine'],
      },
    },
  },
]
