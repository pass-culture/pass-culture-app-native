import { VenueTypeCodeKey } from 'api/gen'
import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import {
  getReconciledVenues,
  convertAlgoliaVenue2AlgoliaVenueOfferListItem,
  convertAlgoliaVenueOffer2AlgoliaVenueOfferListItem,
  AlgoliaVenueOfferWithGeoloc,
} from 'features/search/helpers/searchList/getReconciledVenues'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaVenue, AlgoliaVenueOfferListItem } from 'libs/algolia/types'

const expectedVenues = [
  {
    objectID: '1',
    name: 'Lieu 1',
    postalCode: '75000',
    city: 'Paris',
    banner_url: '',
    venue_type: VenueTypeCodeKey.BOOKSTORE,
    _geoloc: { lat: 48.94374, lng: 2.48171 },
  },
  {
    objectID: '2',
    name: 'Lieu 2',
    postalCode: '75000',
    city: 'Paris',
    banner_url: '',
    venue_type: VenueTypeCodeKey.CONCERT_HALL,
    _geoloc: { lat: 48.91265, lng: 2.4513 },
  },
  {
    objectID: '3',
    name: 'Lieu 3',
    postalCode: '75000',
    city: 'Paris',
    banner_url: '',
    venue_type: VenueTypeCodeKey.CONCERT_HALL,
    _geoloc: { lat: 4.90339, lng: -52.31663 },
  },
  {
    objectID: '4',
    name: 'Lieu 4',
    postalCode: '75000',
    city: 'Paris',
    banner_url: '',
    venue_type: VenueTypeCodeKey.OTHER,
    _geoloc: { lat: 4.90339, lng: -52.31663 },
  },
]
const expectedAlgoliaVenues = [
  {
    _geoloc: {
      lat: 44.82186,
      lng: -0.56366,
    },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
    city: 'Bordeaux',
    name: 'EMS 0063 (ne fonctionne pas)',
    objectID: '7931',
    postalCode: '75000',
    venue_type: 'MOVIE',
  },
  {
    _geoloc: {
      lat: 48.85959,
      lng: 2.33561,
    },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/darya-tryfanava-UCNaGWn4EfU-unsplash.jpg',
    city: 'Paris',
    name: 'ETABLISSEMENT PUBLIC DU MUSEE DU LOUVRE',
    objectID: '7929',
    postalCode: '75000',
    venue_type: 'VISUAL_ARTS',
  },
  {
    _geoloc: {
      lat: 44.85597,
      lng: -0.63444,
    },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/uxuipc_High_angle_avec_un_Canon_R5_50_mm_DSLR_planetarium_with__f16e10f2-eb38-4314-b5f2-784819f04c05%20(1).png',
    city: 'Bordeaux',
    name: 'culture scientifique 2',
    objectID: '7927',
    postalCode: '75000',
    venue_type: 'SCIENTIFIC_CULTURE',
  },
  {
    _geoloc: {
      lat: 43.3112,
      lng: 5.3832,
    },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/edd_Medium-Shot_avec_un_Canon_R5_50_mm_DSLR_Science_class_with__0251a3c2-c494-4b61-8116-a22c61848947%20(1).png',
    city: 'Marseille',
    name: 'culture scientifique 1',
    objectID: '7926',
    postalCode: '75000',
    venue_type: 'SCIENTIFIC_CULTURE',
  },
  {
    _geoloc: {
      lat: 48.84303,
      lng: 2.30445,
    },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/amy-leigh-barnard-H3APOiYLyzk-unsplashed.png',
    city: 'Paris',
    name: 'musee test2',
    objectID: '7924',
    postalCode: '75000',
    venue_type: 'MUSEUM',
  },
  {
    _geoloc: {
      lat: 50.63111,
      lng: 3.0716,
    },
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/erik-mclean-PFfA3xlHFbQ-unsplash_(1).png',
    city: 'Paris',
    name: 'Le Sous-sol DATA',
    objectID: '7922',
    postalCode: '75000',
    venue_type: 'PERFORMING_ARTS',
  },
]

describe('getReconciledVenues', () => {
  it('should return empty array when both venues from offers and algoliavenues are empty', () => {
    const result = getReconciledVenues([], [])

    expect(result).toEqual([])
  })

  it('should return venues from offer when algoliavenues is empty', () => {
    const result = getReconciledVenues(
      [
        ...mockedAlgoliaResponse.hits,
        {
          ...mockedAlgoliaResponse.hits[0],
          venue: { ...mockedAlgoliaResponse.hits[0].venue, id: 1 },
        },
        {
          ...mockedAlgoliaResponse.hits[1],
          venue: { ...mockedAlgoliaResponse.hits[1].venue, id: 5 },
        },
      ],
      []
    )

    expect(result).toEqual([
      ...expectedVenues,
      {
        ...expectedVenues[1],
        objectID: '5',
      },
    ])
  })

  it('should return algoliavenues when venues from offer is empty', () => {
    const result = getReconciledVenues([], mockAlgoliaVenues)

    expect(result).toEqual(expectedAlgoliaVenues)
  })

  it('should return algoliavenues and venues from offer formatted when present and venues disjoint', () => {
    const result = getReconciledVenues(mockedAlgoliaResponse.hits, mockAlgoliaVenues)

    expect(result).toEqual([...expectedAlgoliaVenues, ...expectedVenues])
  })

  it('should return deduped algoliavenues and venues from offer formatted when present and venues ids duplicated', () => {
    const _mockAlgoliaVenues = [
      {
        audio_disability: false,
        banner_url:
          'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
        city: 'Bordeaux',
        description: '',
        email: null,
        facebook: null,

        instagram: null,
        mental_disability: false,
        motor_disability: false,
        name: 'EMS 0063 (ne fonctionne pas)',
        objectID: '1',
        offerer_name: 'Structure du cinéma EMS',
        phone_number: null,
        snapchat: null,
        twitter: null,
        venue_type: VenueTypeCodeKey.MOVIE,
        visual_disability: false,
        isPermanent: true,
        isOpenToPublic: true,
        website: null,
        _geoloc: { lat: 44.82186, lng: -0.56366 },
        postalCode: '75000',
      },

      {
        audio_disability: false,
        banner_url:
          'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/darya-tryfanava-UCNaGWn4EfU-unsplash.jpg',
        city: 'Paris',
        description: '',
        email: null,
        facebook: null,
        instagram: null,
        mental_disability: false,
        motor_disability: false,
        name: 'ETABLISSEMENT PUBLIC DU MUSEE DU LOUVRE',
        objectID: '3',
        offerer_name: 'ETABLISSEMENT PUBLIC DU MUSEE DU LOUVRE',
        phone_number: null,
        snapchat: null,
        twitter: null,
        venue_type: VenueTypeCodeKey.VISUAL_ARTS,
        visual_disability: false,
        website: null,
        isPermanent: true,
        isOpenToPublic: true,
        _geoloc: { lat: 48.85959, lng: 2.33561 },
        postalCode: '75000',
      },
    ]

    const expectedAlgoliaVenuesDedup = [
      {
        _geoloc: {
          lat: 44.82186,
          lng: -0.56366,
        },
        banner_url:
          'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
        city: 'Bordeaux',
        name: 'EMS 0063 (ne fonctionne pas)',
        objectID: '1',
        postalCode: '75000',
        venue_type: 'MOVIE',
      },
      {
        _geoloc: {
          lat: 48.85959,
          lng: 2.33561,
        },
        banner_url:
          'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/darya-tryfanava-UCNaGWn4EfU-unsplash.jpg',
        city: 'Paris',
        name: 'ETABLISSEMENT PUBLIC DU MUSEE DU LOUVRE',
        objectID: '3',
        postalCode: '75000',
        venue_type: 'VISUAL_ARTS',
      },
    ]

    const result = getReconciledVenues(mockedAlgoliaResponse.hits, _mockAlgoliaVenues)

    expect(result).toEqual([...expectedAlgoliaVenuesDedup, expectedVenues[1], expectedVenues[3]])
  })
})

describe('convertAlgoliaVenue2AlgoliaVenueOfferListItem', () => {
  it('should return formatted venue when venue exists', () => {
    const expectedAlgoliaVenueOffer: AlgoliaVenueOfferListItem = {
      objectID: '7931',
      banner_url:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
      city: 'Bordeaux',
      name: 'EMS 0063 (ne fonctionne pas)',
      postalCode: '75000',
      venue_type: VenueTypeCodeKey.MOVIE,
      _geoloc: { lat: 44.82186, lng: -0.56366 },
    }

    const result = convertAlgoliaVenue2AlgoliaVenueOfferListItem(
      mockAlgoliaVenues[0] ?? <AlgoliaVenue>{}
    )

    expect(result).toEqual(expectedAlgoliaVenueOffer)
  })

  it('should return default when fields are missing', () => {
    const expectedAlgoliaVenueOffer: AlgoliaVenueOfferListItem = {
      objectID: '7931',
      banner_url:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
      city: 'Bordeaux',
      name: 'EMS 0063 (ne fonctionne pas)',
      postalCode: '75000',
      venue_type: VenueTypeCodeKey.MOVIE,
      _geoloc: { lat: 44.82186, lng: -0.56366 },
    }

    const result = convertAlgoliaVenue2AlgoliaVenueOfferListItem(
      mockAlgoliaVenues[0] ?? <AlgoliaVenue>{}
    )

    expect(result).toEqual(expectedAlgoliaVenueOffer)
  })
})

describe('convertAlgoliaVenueOffer2AlgoliaVenueOfferListItem', () => {
  it('should return formatted venue when venue exists', () => {
    const expectedAlgoliaVenueOffer: AlgoliaVenueOfferListItem = {
      objectID: '1',
      banner_url: '',
      city: 'Paris',
      name: 'Lieu 1',
      postalCode: '75000',
      venue_type: VenueTypeCodeKey.BOOKSTORE,
      _geoloc: { lat: 48.94374, lng: 2.48171 },
    }
    const result = convertAlgoliaVenueOffer2AlgoliaVenueOfferListItem({
      ...mockedAlgoliaResponse.hits[0].venue,
      geoloc: mockedAlgoliaResponse.hits[0]._geoloc,
    })

    expect(result).toEqual(expectedAlgoliaVenueOffer)
  })

  it('should return default when fields are missing', () => {
    const mockedAlgoliaVenueOffer: AlgoliaVenueOfferWithGeoloc = {
      geoloc: { lat: 48.94374, lng: 2.48171 },
    }
    const expectedAlgoliaVenueOffer: AlgoliaVenueOfferListItem = {
      objectID: '',
      banner_url: '',
      city: '',
      name: '',
      postalCode: '',
      venue_type: VenueTypeCodeKey.OTHER,
      _geoloc: { lat: 48.94374, lng: 2.48171 },
    }
    const result = convertAlgoliaVenueOffer2AlgoliaVenueOfferListItem(mockedAlgoliaVenueOffer)

    expect(result).toEqual(expectedAlgoliaVenueOffer)
  })
})
