import algoliasearch from 'algoliasearch'

import { AlgoliaVenue } from 'libs/algolia'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { env } from 'libs/environment'
import { waitFor } from 'tests/utils'

jest.mock('algoliasearch')

const mockInitIndex = algoliasearch('', '').initIndex
const search = mockInitIndex('').search as jest.Mock
jest.mock('libs/algolia/fetchAlgolia/AlgoliaError', () => ({
  captureAlgoliaError: jest.fn(),
}))

describe('fetchVenues', () => {
  const venueFixture: AlgoliaVenue = {
    _geoloc: { lat: 48.87004, lng: 2.3785 },
    audio_disability: false,
    banner_url: null,
    city: 'Saint-Benoît',
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
    venue_type: 'PERFORMING_ARTS',
    visual_disability: false,
    website: 'https://my.website.com',
  }
  it('should fetch venues', () => {
    fetchVenues('queryString')

    expect(mockInitIndex).toHaveBeenCalledWith(env.ALGOLIA_VENUES_INDEX_NAME)
    expect(search).toHaveBeenCalledWith('queryString', { attributesToHighlight: [] })
  })
  it.each`
    fixture | expectedResult
    ${{ hits: [venueFixture] }} | ${{
  label: '[EAC] Le lieu de Moz’Art 50',
  info: 'Saint-Benoît',
  venueId: 4150,
}}
    ${{ hits: [{ ...venueFixture, city: undefined }] }} | ${{
  label: '[EAC] Le lieu de Moz’Art 50',
  info: '[EAC] La structure de Moz’Art 32',
  venueId: 4150,
}}
  `('should fetch venues and format them correctly ', async ({ fixture, expectedResult }) => {
    search.mockResolvedValueOnce(fixture)

    const venues = await fetchVenues('queryString')

    expect(mockInitIndex).toHaveBeenCalledWith(env.ALGOLIA_VENUES_INDEX_NAME)
    expect(search).toHaveBeenCalledWith('queryString', { attributesToHighlight: [] })
    expect(venues).toEqual([expectedResult])
  })

  it('should catch an error', async () => {
    const error = new Error('Async error')
    search.mockRejectedValueOnce(error)
    fetchVenues('queryString')

    await waitFor(async () => {
      expect(captureAlgoliaError).toHaveBeenCalledWith(error)
    })
  })
})
