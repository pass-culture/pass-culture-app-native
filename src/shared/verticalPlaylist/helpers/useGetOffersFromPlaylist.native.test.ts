import { useGetOffersModuleDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import { OffersModule } from 'features/home/types'
import { renderHook } from 'tests/utils'

import { useGetOffersFromPlaylist } from './useGetOffersFromPlaylist'

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: { query: 'test-query', searchId: 'search-id' } }),
}))

const mockUseGetOffersModuleDataQuery = useGetOffersModuleDataQuery as jest.Mock
jest.mock('features/home/queries/useGetOffersDataQuery', () => ({
  useGetOffersModuleDataQuery: jest.fn(),
}))

const mockModule = {
  displayParameters: {
    title: 'Module title',
    subtitle: 'Module subtitle',
    layout: 'two-items',
    minOffers: 2,
  },
} as OffersModule

describe('useGetOffersFromPlaylist', () => {
  it('should return items from query', () => {
    mockUseGetOffersModuleDataQuery.mockReturnValueOnce({
      data: { playlistItems: [{ objectID: '1' }, { objectID: '2' }] },
    })

    const { result } = renderHook(() => useGetOffersFromPlaylist({ ...mockModule }))

    expect(result.current.items).toHaveLength(2)
  })

  it('should return correct metadata', () => {
    mockUseGetOffersModuleDataQuery.mockReturnValueOnce({ data: { playlistItems: [] } })

    const { result } = renderHook(() => useGetOffersFromPlaylist({ ...mockModule }))

    expect(result.current.title).toBe('Module title')
    expect(result.current.subtitle).toBe('Module subtitle')
    expect(result.current.searchId).toBe('search-id')
    expect(result.current.searchQuery).toBe('test-query')
  })

  it('should return empty items when no data', () => {
    mockUseGetOffersModuleDataQuery.mockReturnValueOnce({ data: undefined })

    const { result } = renderHook(() => useGetOffersFromPlaylist({ ...mockModule }))

    expect(result.current.items).toEqual([])
  })
})
