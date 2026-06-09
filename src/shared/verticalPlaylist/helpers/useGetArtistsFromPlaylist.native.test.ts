import { useSimilarArtistsQuery } from 'features/artist/queries/useSimilarArtistsQuery'
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

jest.mock('features/artist/queries/useSimilarArtistsQuery')
const mockUseSimilarArtistsQuery = useSimilarArtistsQuery as jest.Mock
mockUseSimilarArtistsQuery.mockReturnValue({ data: undefined })

const paramsFromSearch = {
  params: { title: 'Artists title', subtitle: 'Artists subtitle' },
}

const paramsWithVenue = {
  params: { title: 'Artists title', subtitle: 'Artists subtitle', venueId: 123 },
}

const paramsWithSimilarArtist = {
  params: { title: 'Artists title', subtitle: 'Artists subtitle', similarToArtistId: 'artist-id' },
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

  it('should return similar artists and disable venue/search queries when similarToArtistId is provided', () => {
    mockUseSimilarArtistsQuery.mockReturnValueOnce({ data: [{ id: 5 }, { id: 6 }] })
    mockUseSearchArtistsQuery.mockReturnValueOnce({ data: [{ id: 3 }] })

    const { result } = renderHook(() => useGetArtistsFromPlaylist(paramsWithSimilarArtist), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.nbItems).toBe(2)
    expect(result.current.items).toEqual([{ id: 5 }, { id: 6 }])
    expect(mockUseSimilarArtistsQuery).toHaveBeenCalledWith('artist-id', { enabled: true })
    expect(mockUseSearchArtistsQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ enabled: false })
    )
    expect(mockGetVenueOffersArtists).not.toHaveBeenCalled()
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
