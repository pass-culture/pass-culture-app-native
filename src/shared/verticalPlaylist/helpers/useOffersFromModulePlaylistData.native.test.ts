import { useGetOffersDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import { OffersModule } from 'features/home/types'
import { renderHook } from 'tests/utils'

import { useOffersFromModulePlaylistData } from './useOffersFromModulePlaylistData'

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: { query: 'test-query', searchId: 'search-id' } }),
}))

const mockUseGetOffersDataQuery = useGetOffersDataQuery as jest.Mock
jest.mock('features/home/queries/useGetOffersDataQuery', () => ({
  useGetOffersDataQuery: jest.fn(),
}))

const mockModule = {
  displayParameters: {
    title: 'Module title',
    subtitle: 'Module subtitle',
    layout: 'two-items',
    minOffers: 2,
  },
} as OffersModule

describe('useOffersFromModulePlaylistData', () => {
  it('should return items from query', () => {
    mockUseGetOffersDataQuery.mockReturnValueOnce([
      { playlistItems: [{ objectID: '1' }, { objectID: '2' }] },
    ])

    const { result } = renderHook(() => useOffersFromModulePlaylistData({ module: mockModule }))

    expect(result.current.items).toHaveLength(2)
  })

  it('should return correct metadata', () => {
    mockUseGetOffersDataQuery.mockReturnValueOnce([{ playlistItems: [] }])

    const { result } = renderHook(() => useOffersFromModulePlaylistData({ module: mockModule }))

    expect(result.current.title).toBe('Module title')
    expect(result.current.subtitle).toBe('Module subtitle')
    expect(result.current.searchId).toBe('search-id')
    expect(result.current.searchQuery).toBe('test-query')
  })

  it('should return empty items when no data', () => {
    mockUseGetOffersDataQuery.mockReturnValueOnce(undefined)

    const { result } = renderHook(() => useOffersFromModulePlaylistData({ module: mockModule }))

    expect(result.current.items).toEqual([])
  })
})
