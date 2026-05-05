import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { getVenueOffersArtists } from 'features/venue/helpers/getVenueOffersArtists'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

import { useGetArtistsFromPlaylist } from './useGetArtistsFromPlaylist'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: { query: 'test-query', searchId: 'search-id' } }),
}))

jest.mock('libs/firebase/remoteConfig/queries/useRemoteConfigQuery')
const mockUseRemoteConfigQuery = useRemoteConfigQuery as jest.Mock
mockUseRemoteConfigQuery.mockReturnValue({
  data: { artistPageSubcategories: { subcategories: [] }, aroundPrecision: 100 },
})

jest.mock('features/venue/helpers/getVenueOffersArtists')
const mockGetVenueOffersArtists = getVenueOffersArtists as jest.Mock

jest.mock('features/search/queries/useSearchArtists/useSearchArtistsQuery')
const mockUseSearchArtistsQuery = useSearchArtistsQuery as jest.Mock

const paramsFromSearch = {
  params: { title: 'Artists title', subtitle: 'Artists subtitle' },
}

const paramsWithVenue = {
  params: { title: 'Artists title', subtitle: 'Artists subtitle', venueId: 123 },
}

describe('useGetArtistsFromPlaylist', () => {
  it('should return artists from venue when available', () => {
    mockGetVenueOffersArtists.mockReturnValueOnce({ data: { artists: [{ id: 1 }, { id: 2 }] } })
    mockUseSearchArtistsQuery.mockReturnValueOnce({ data: [{ id: 3 }] })

    const { result } = renderHook(() => useGetArtistsFromPlaylist(paramsWithVenue), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.nbItems).toBe(2)
    expect(result.current.items).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('should fallback to search artists when no venue artists', () => {
    mockGetVenueOffersArtists.mockReturnValueOnce({ data: { artists: [] } })
    mockUseSearchArtistsQuery.mockReturnValueOnce({ data: [{ id: 3 }, { id: 4 }] })

    const { result } = renderHook(() => useGetArtistsFromPlaylist(paramsFromSearch), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.nbItems).toBe(2)
    expect(result.current.items).toEqual([{ id: 3 }, { id: 4 }])
  })

  it('should return empty array when no data', () => {
    mockGetVenueOffersArtists.mockReturnValueOnce({ data: { artists: [] } })
    mockUseSearchArtistsQuery.mockReturnValueOnce({ data: undefined })

    const { result } = renderHook(() => useGetArtistsFromPlaylist(paramsFromSearch), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.nbItems).toBe(0)
    expect(result.current.items).toEqual([])
  })

  it('should return correct metadata', () => {
    mockGetVenueOffersArtists.mockReturnValueOnce({ data: { artists: [] } })
    mockUseSearchArtistsQuery.mockReturnValueOnce({ data: [] })

    const { result } = renderHook(() => useGetArtistsFromPlaylist(paramsFromSearch), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.title).toBe('Artists title')
    expect(result.current.subtitle).toBe('Artists subtitle')
  })
})
