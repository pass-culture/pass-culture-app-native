import mockdate from 'mockdate'

import { useFreeEventsQuery } from 'features/generalPublicHome/queries/useFreeEventsQuery'
import { useGetOffersModuleDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import { LocationMode } from 'libs/location/types'
import { locationActions } from 'libs/locationV2/location.store'
import { renderHook } from 'tests/utils'

const mockUseGetOffersModuleDataQuery = useGetOffersModuleDataQuery as jest.Mock
jest.mock('features/home/queries/useGetOffersDataQuery', () => ({
  useGetOffersModuleDataQuery: jest.fn(),
}))

// Wednesday
const NOW = new Date('2026-10-14T10:30:00.000Z')

describe('useFreeEventsQuery', () => {
  beforeEach(() => {
    mockdate.set(NOW)
    mockUseGetOffersModuleDataQuery.mockReturnValue({ data: undefined, isLoading: false })
  })

  afterEach(() => mockdate.reset())

  describe('offers', () => {
    it('should return the offers of the module data', () => {
      mockUseGetOffersModuleDataQuery.mockReturnValueOnce({
        data: { playlistItems: [{ objectID: '1' }, { objectID: '2' }] },
        isLoading: false,
      })

      const { result } = renderHook(() => useFreeEventsQuery({ dateFilter: null }))

      expect(result.current.offers).toEqual([{ objectID: '1' }, { objectID: '2' }])
    })

    it('should return no offer without data', () => {
      const { result } = renderHook(() => useFreeEventsQuery({ dateFilter: null }))

      expect(result.current.offers).toEqual([])
    })

    it('should return no offer when the module data holds venues', () => {
      mockUseGetOffersModuleDataQuery.mockReturnValueOnce({
        data: { playlistItems: [{ id: 1, name: 'Venue' }] },
        isLoading: false,
      })

      const { result } = renderHook(() => useFreeEventsQuery({ dateFilter: null }))

      expect(result.current.offers).toEqual([])
    })

    it('should forward the module data', () => {
      const data = { playlistItems: [{ objectID: '1' }], nbPlaylistResults: 1, moduleId: 'id' }
      mockUseGetOffersModuleDataQuery.mockReturnValueOnce({ data, isLoading: false })

      const { result } = renderHook(() => useFreeEventsQuery({ dateFilter: null }))

      expect(result.current.data).toBe(data)
    })

    it('should forward the loading state', () => {
      mockUseGetOffersModuleDataQuery.mockReturnValueOnce({ data: undefined, isLoading: true })

      const { result } = renderHook(() => useFreeEventsQuery({ dateFilter: null }))

      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('module', () => {
    it('should query a free events module built from the filters', () => {
      const { result } = renderHook(() =>
        useFreeEventsQuery({ dateFilter: { type: 'day', date: '2026-10-20' }, themeId: 'cinema' })
      )

      expect(mockUseGetOffersModuleDataQuery).toHaveBeenCalledWith(result.current.module)
      expect(result.current.module.title).toBe('Cinéma')
      expect(result.current.module.offersModuleParameters[0]).toEqual(
        expect.objectContaining({
          priceMax: 0,
          categories: ['Cinéma'],
          beginningDatetime: '2026-10-20T00:00:00.000Z',
          endingDatetime: '2026-10-20T23:59:59.999Z',
        })
      )
    })

    it('should use the radius of the current location mode', () => {
      locationActions.setLocationMode(LocationMode.AROUND_ME)
      locationActions.setAroundMeRadius(15)

      const { result } = renderHook(() => useFreeEventsQuery({ dateFilter: null }))

      expect(result.current.module.offersModuleParameters[0]?.aroundRadius).toBe(15)
    })

    it('should keep the same module across renders of the same day', () => {
      const dateFilter = null
      const { result, rerender } = renderHook(() => useFreeEventsQuery({ dateFilter }))
      const firstModule = result.current.module

      mockdate.set(new Date('2026-10-14T18:00:00.000Z'))
      rerender({})

      expect(result.current.module).toBe(firstModule)
    })

    it('should rebuild the module from the new now when the day changes', () => {
      const { result, rerender } = renderHook(() => useFreeEventsQuery({ dateFilter: null }))

      mockdate.set(new Date('2026-10-15T08:00:00.000Z'))
      rerender({})

      expect(result.current.module.offersModuleParameters[0]?.beginningDatetime).toBe(
        '2026-10-15T08:00:00.000Z'
      )
    })
  })
})
