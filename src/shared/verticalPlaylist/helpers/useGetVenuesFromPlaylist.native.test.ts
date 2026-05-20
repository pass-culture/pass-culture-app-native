import { useGetVenuesData } from 'features/home/api/useGetVenuesData'
import { VenuesModule } from 'features/home/types'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { renderHook } from 'tests/utils'

import { useGetVenuesFromPlaylist } from './useGetVenuesFromPlaylist'

jest.mock('features/home/api/useGetVenuesData', () => ({ useGetVenuesData: jest.fn() }))

const mockUseGetVenuesData = useGetVenuesData as jest.Mock

const mockModule = {
  type: VerticalPlaylist.ModuleVenues,
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
  beforeEach(() => jest.clearAllMocks())

  describe('Home module', () => {
    it('should return items from home query', () => {
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

      const { result } = renderHook(() => useGetVenuesFromPlaylist({ module: mockModule }))

      expect(result.current.items).toHaveLength(2)
      expect(result.current.hasDataError).toBe(false)
    })

    it('should return empty items when venuesModulesData is empty', () => {
      mockUseGetVenuesData.mockReturnValueOnce({ venuesModulesData: [] })
      const { result } = renderHook(() => useGetVenuesFromPlaylist({ module: mockModule }))

      expect(result.current.items).toEqual([])
      expect(result.current.nbItems).toBe(0)
      expect(result.current.hasDataError).toBe(true)
    })

    it('should detect home data error when undefined', () => {
      mockUseGetVenuesData.mockReturnValueOnce({ venuesModulesData: undefined })
      const { result } = renderHook(() => useGetVenuesFromPlaylist({ module: mockModule }))

      expect(result.current.hasDataError).toBe(true)
    })
  })

  describe('Search module', () => {
    const searchModule = {
      ...mockModule,
      type: VerticalPlaylist.ThematicSearchVenues,
      data: [
        { objectID: '1', name: 'Search venue 1', banner_url: 'url-1' },
        { objectID: '2', name: 'Search venue 2', banner_url: 'url-2' },
      ],
    } as unknown as VenuesModule

    it('should normalize search data correctly', () => {
      mockUseGetVenuesData.mockReturnValueOnce({ venuesModulesData: [] })
      const { result } = renderHook(() => useGetVenuesFromPlaylist({ module: searchModule }))

      expect(result.current.items).toHaveLength(2)
      expect(result.current.items[0]).toHaveProperty('bannerUrl', 'url-1')
      expect(result.current.items[0]).toHaveProperty('id', '1')
    })

    it('should fallback to empty array when data is undefined', () => {
      const moduleWithoutData = { ...searchModule, data: undefined }
      mockUseGetVenuesData.mockReturnValueOnce({ venuesModulesData: [] })
      const { result } = renderHook(() => useGetVenuesFromPlaylist({ module: moduleWithoutData }))

      expect(result.current.items).toEqual([])
      expect(result.current.hasDataError).toBe(true)
    })

    it('should return metadata correctly for search', () => {
      mockUseGetVenuesData.mockReturnValueOnce({ venuesModulesData: [] })
      const { result } = renderHook(() => useGetVenuesFromPlaylist({ module: searchModule }))

      expect(result.current.title).toBe('Module title')
      expect(result.current.subtitle).toBe('Module subtitle')
    })
  })
})
