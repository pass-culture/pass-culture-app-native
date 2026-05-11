import { useGetVenuesData } from 'features/home/api/useGetVenuesData'
import { VenuesModule } from 'features/home/types'
import { renderHook } from 'tests/utils'

import { useGetVenuesFromPlaylist } from './useGetVenuesFromPlaylist'

const mockUseGetVenuesData = useGetVenuesData as jest.Mock

jest.mock('features/home/api/useGetVenuesData', () => ({
  useGetVenuesData: jest.fn(),
}))

const mockModule = {
  type: 'venues',
  id: 'module-id',
  displayParameters: {
    title: 'Module title',
    subtitle: 'Module subtitle',
    layout: 'two-items',
    minOffers: 2,
  },
  venuesParameters: {
    title: 'Venues module',
    hitsPerPage: 10,
    isGeolocated: false,
  },
  data: undefined,
} as unknown as VenuesModule

describe('useGetVenuesFromPlaylist', () => {
  it('should return items from query', () => {
    mockUseGetVenuesData.mockReturnValueOnce({
      venuesModulesData: [
        {
          playlistItems: [
            { id: 1, name: 'Venue 1', city: 'Paris' },
            { id: 2, name: 'Venue 2', city: 'Lyon' },
          ],
        },
      ],
    })

    const { result } = renderHook(() => useGetVenuesFromPlaylist({ ...mockModule }))

    expect(result.current.items).toHaveLength(2)
  })

  it('should return correct metadata', () => {
    mockUseGetVenuesData.mockReturnValueOnce({
      venuesModulesData: [{ playlistItems: [] }],
    })

    const { result } = renderHook(() => useGetVenuesFromPlaylist({ ...mockModule }))

    expect(result.current.title).toBe('Module title')
    expect(result.current.subtitle).toBe('Module subtitle')
    expect(result.current.nbItems).toBe(0)
  })

  it('should return empty items when no data', () => {
    mockUseGetVenuesData.mockReturnValueOnce({
      venuesModulesData: undefined,
    })

    const { result } = renderHook(() => useGetVenuesFromPlaylist({ ...mockModule }))

    expect(result.current.items).toEqual([])
    expect(result.current.nbItems).toBe(0)
  })
})
