import { FetchSearchVenuesResponse } from 'features/search/queries/useSearchVenuesQuery/types'
import { AlgoliaVenue } from 'libs/algolia/types'

import { selectSearchVenues } from './selectSearchVenues'

describe('selectSearchVenues', () => {
  it('should map and organize venue data from the response', () => {
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

    const result = selectSearchVenues(mockResponse)

    expect(result.algoliaVenues).toEqual([mockVenueOpen])
    expect(result.venues).toEqual([expect.objectContaining({ objectID: 'v1', name: 'Venue Open' })])
    expect(result.venuesUserData).toEqual([{ venue_playlist_title: 'venue playlist title' }])
    expect(result.venueNotOpenToPublic).toEqual([mockVenueNotOpenToPublic])
  })

  it('should handle undefined or empty responses', () => {
    const mockEmptyResponse: FetchSearchVenuesResponse = {
      venuesResponse: undefined,
      venueNotOpenToPublic: undefined,
    }

    const result = selectSearchVenues(mockEmptyResponse)

    expect(result.algoliaVenues).toEqual([])
    expect(result.venues).toEqual([])
    expect(result.venuesUserData).toBeUndefined()
    expect(result.venueNotOpenToPublic).toEqual([])
  })
})
