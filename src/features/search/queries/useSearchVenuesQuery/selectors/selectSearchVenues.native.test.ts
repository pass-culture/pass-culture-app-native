import { FetchSearchVenuesResponse } from 'features/search/queries/useSearchVenuesQuery/types'
import { AlgoliaVenue } from 'libs/algolia/types'

import { selectSearchVenues } from './selectSearchVenues'

const mockVenueOpen = { objectID: 'v1', name: 'Venue Open' } as AlgoliaVenue
const mockVenueNotOpenToPublic = {
  objectID: 'v2',
  name: 'Venue Not Open To Public',
} as AlgoliaVenue

const mockResponse: FetchSearchVenuesResponse = {
  venuesResponse: {
    hits: [mockVenueOpen],
    userData: [{ venue_playlist_title: 'venue playlist title' }],
  },
  venueNotOpenToPublic: {
    hits: [mockVenueNotOpenToPublic],
  },
}

const emptyResponse: FetchSearchVenuesResponse = {
  venuesResponse: undefined,
  venueNotOpenToPublic: undefined,
}

describe('selectSearchVenues', () => {
  describe('selectedFilter', () => {
    it('should return venues when selectedFilter is null', () => {
      const result = selectSearchVenues(mockResponse, null)

      expect(result.algoliaVenues).toEqual([mockVenueOpen])
      expect(result.venues).toEqual([
        expect.objectContaining({ objectID: 'v1', name: 'Venue Open' }),
      ])
    })

    it('should return venues when selectedFilter is "Lieux"', () => {
      const result = selectSearchVenues(mockResponse, 'Lieux')

      expect(result.algoliaVenues).toEqual([mockVenueOpen])
      expect(result.venues).toEqual([
        expect.objectContaining({ objectID: 'v1', name: 'Venue Open' }),
      ])
    })

    it('should return empty venues when selectedFilter is "Offres"', () => {
      const result = selectSearchVenues(mockResponse, 'Offres')

      expect(result.algoliaVenues).toEqual([])
      expect(result.venues).toEqual([])
    })

    it('should return empty venues when selectedFilter is "Artistes"', () => {
      const result = selectSearchVenues(mockResponse, 'Artistes')

      expect(result.algoliaVenues).toEqual([])
      expect(result.venues).toEqual([])
    })

    it('should always return venuesUserData and venueNotOpenToPublic regardless of selectedFilter', () => {
      const filters = ['Offres', 'Lieux', 'Artistes', null] as const

      filters.forEach((selectedFilter) => {
        const result = selectSearchVenues(mockResponse, selectedFilter)

        expect(result.venuesUserData).toEqual([{ venue_playlist_title: 'venue playlist title' }])
        expect(result.venueNotOpenToPublic).toEqual([mockVenueNotOpenToPublic])
      })
    })
  })

  describe('data mapping', () => {
    it('should map venue data correctly', () => {
      const result = selectSearchVenues(mockResponse, null)

      expect(result.venuesUserData).toEqual([{ venue_playlist_title: 'venue playlist title' }])
      expect(result.venueNotOpenToPublic).toEqual([mockVenueNotOpenToPublic])
    })

    it('should handle undefined or empty responses', () => {
      const result = selectSearchVenues(emptyResponse, null)

      expect(result.algoliaVenues).toEqual([])
      expect(result.venues).toEqual([])
      expect(result.venuesUserData).toBeUndefined()
      expect(result.venueNotOpenToPublic).toEqual([])
    })
  })
})
