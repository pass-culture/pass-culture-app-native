import { VenueTypeCodeKey } from 'api/gen'
import { VENUES_FACETS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { AlgoliaVenue, LocationMode } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { waitFor } from 'tests/utils'

jest.mock('libs/algolia/fetchAlgolia/clients')
const mockSearchForHits = client.searchForHits as jest.Mock

jest.mock('libs/algolia/fetchAlgolia/AlgoliaError', () => ({
  captureAlgoliaError: jest.fn(),
}))

const facetFilters = [[`${VENUES_FACETS_ENUM.HAS_AT_LEAST_ONE_BOOKABLE_OFFER}:true`]]

describe('fetchVenues', () => {
  const venueFixture: AlgoliaVenue = {
    _geoloc: { lat: 48.87004, lng: 2.3785 },
    audio_disability: false,
    banner_url: null,
    city: 'Saint-Benoît',
    postalCode: '86280',
    description: 'Share small center heart energy bring main.',
    email: 'contact@venue.com',
    facebook: null,
    instagram: 'http://instagram.com/@venue',
    mental_disability: false,
    motor_disability: false,
    name: '[EAC] Le lieu de Moz’Art 50',
    objectID: '4150',
    offerer_name: '[EAC] La structure de Moz’Art 32',
    phone_number: '+33102030405',
    snapchat: null,
    twitter: null,
    isPermanent: true,
    isOpenToPublic: true,
    venue_type: VenueTypeCodeKey.PERFORMING_ARTS,
    visual_disability: false,
    website: 'https://my.website.com',
  }
  const buildLocationParameterParams = {
    userLocation: undefined,
    selectedLocationMode: LocationMode.EVERYWHERE,
    aroundMeRadius: 50,
    aroundPlaceRadius: 50,
  }

  beforeEach(() => {
    mockSearchForHits.mockResolvedValue({ results: [{ hits: [] }] })
  })

  it('should fetch venues', async () => {
    await fetchVenues({
      query: 'queryString',
      buildLocationParameterParams,
    })

    expect(mockSearchForHits).toHaveBeenCalledWith({
      requests: [
        expect.objectContaining({
          indexName: env.ALGOLIA_VENUES_INDEX_NAME,
          query: 'queryString',
          attributesToHighlight: [],
          facetFilters,
        }),
      ],
    })
  })

  it('should fetch venues with a specified position', async () => {
    const userLocation = { latitude: 48.90374, longitude: 2.48171 }
    await fetchVenues({
      query: 'queryString',
      buildLocationParameterParams: { ...buildLocationParameterParams, userLocation },
    })

    expect(mockSearchForHits).toHaveBeenCalledWith({
      requests: [
        expect.objectContaining({
          indexName: env.ALGOLIA_VENUES_INDEX_NAME,
          query: 'queryString',
          attributesToHighlight: [],
          facetFilters,
          aroundLatLng: '48.90374, 2.48171',
          aroundRadius: 'all',
        }),
      ],
    })
  })

  it.each`
    fixture                                             | expectedResult
    ${{ hits: [venueFixture] }}                         | ${{ label: '[EAC] Le lieu de Moz’Art 50', info: 'Saint-Benoît', venueId: 4150, _geoloc: { lat: 48.87004, lng: 2.3785 }, banner_url: null, isPermanent: true, postalCode: '86280', venue_type: VenueTypeCodeKey.PERFORMING_ARTS, isOpenToPublic: true }}
    ${{ hits: [{ ...venueFixture, city: undefined }] }} | ${{ label: '[EAC] Le lieu de Moz’Art 50', info: '[EAC] La structure de Moz’Art 32', venueId: 4150, _geoloc: { lat: 48.87004, lng: 2.3785 }, banner_url: null, postalCode: '86280', isPermanent: true, venue_type: VenueTypeCodeKey.PERFORMING_ARTS, isOpenToPublic: true }}
  `('should fetch venues and format them correctly', async ({ fixture, expectedResult }) => {
    mockSearchForHits.mockResolvedValueOnce({ results: [fixture] })

    const venues = await fetchVenues({ query: 'queryString', buildLocationParameterParams })

    expect(mockSearchForHits).toHaveBeenCalledWith({
      requests: [
        expect.objectContaining({
          indexName: env.ALGOLIA_VENUES_INDEX_NAME,
          query: 'queryString',
          attributesToHighlight: [],
          facetFilters,
        }),
      ],
    })
    expect(venues).toEqual([expectedResult])
  })

  it('should catch an error', async () => {
    const error = new Error('Async error')
    mockSearchForHits.mockRejectedValueOnce(error)
    await fetchVenues({ query: 'queryString', buildLocationParameterParams })

    await waitFor(async () => {
      expect(captureAlgoliaError).toHaveBeenCalledWith(error)
    })
  })
})
