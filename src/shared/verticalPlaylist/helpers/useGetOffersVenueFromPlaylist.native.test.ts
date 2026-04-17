import { renderHook } from 'tests/utils'

import { useGetOffersVenueFromPlaylist } from './useGetOffersVenueFromPlaylist'

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: { query: 'test', searchId: 'search-id' } }),
}))

jest.mock('features/venue/queries/useVenueQuery')
jest.mock('queries/venue/useVenueOffersQuery')

const fakeVenueId = 1234

describe('useGetOffersVenueFromPlaylist', () => {
  it('should filter out SEANCE_CINE offers', () => {
    const { result } = renderHook(() =>
      useGetOffersVenueFromPlaylist({ venueId: fakeVenueId, playlistTitle: 'Playlist title' })
    )

    expect(result.current.items).toHaveLength(3)
  })

  it('should return correct metadata', () => {
    const { result } = renderHook(() =>
      useGetOffersVenueFromPlaylist({ venueId: fakeVenueId, playlistTitle: 'Playlist title' })
    )

    expect(result.current.title).toBe('Playlist title')
    expect(result.current.searchId).toBe('search-id')
    expect(result.current.searchQuery).toBe('test')
  })
})
