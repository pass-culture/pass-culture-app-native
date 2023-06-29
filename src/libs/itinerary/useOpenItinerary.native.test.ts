import * as Itinerary from 'libs/itinerary/useItinerary'
import { renderHook } from 'tests/utils'

import useOpenItinerary from './useOpenItinerary'

describe('useOpenItinerary', () => {
  let useItinerary: jest.SpyInstance<ReturnType<typeof Itinerary.useItinerary>, []> | undefined

  beforeEach(() => {
    useItinerary = jest.spyOn(Itinerary, 'useItinerary')
  })
  afterEach(() => useItinerary?.mockRestore())

  describe('beforeNavigate', () => {
    it('should call beforeNavigate', () => {
      useItinerary?.mockReturnValue({ navigateTo: jest.fn() })
      const beforeNavigate = jest.fn()

      const { result } = renderHook(() => useOpenItinerary('0.45, 1.45', beforeNavigate))
      result.current.openItinerary()

      expect(beforeNavigate).toHaveBeenCalledTimes(1)
    })
    it('should not call beforeNavigate', () => {
      useItinerary?.mockReturnValue({ navigateTo: jest.fn() })
      const beforeNavigate = jest.fn()

      const { result } = renderHook(() => useOpenItinerary(undefined, beforeNavigate))
      result.current.openItinerary()

      expect(beforeNavigate).not.toBeCalled()
    })
  })
  describe('canOpenItinerary', () => {
    it('should return true', () => {
      useItinerary?.mockReturnValue({ navigateTo: jest.fn() })

      const { result } = renderHook(() => useOpenItinerary('0.45, 1.45'))

      expect(result.current.canOpenItinerary).toBe(true)
    })
    it.each<[string, string | undefined | null]>([
      ['address is undefined', undefined],
      ['address is null', null],
    ])('should return false when %s', (_reason, address) => {
      useItinerary?.mockReturnValue({ navigateTo: jest.fn() })

      const { result } = renderHook(() => useOpenItinerary(address))

      expect(result.current.canOpenItinerary).toBe(false)
    })
  })
})
