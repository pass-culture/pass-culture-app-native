import * as Itinerary from 'libs/itinerary/useItinerary'
import { renderHook } from 'tests/utils'

import useOpenItinerary from './useOpenItinerary'

jest.spyOn(Itinerary, 'useItinerary').mockReturnValue({ navigateTo: jest.fn() })

describe('useOpenItinerary', () => {
  describe('beforeNavigate', () => {
    it('should call beforeNavigate', () => {
      const beforeNavigate = jest.fn()

      const { result } = renderHook(() => useOpenItinerary('0.45, 1.45', beforeNavigate))
      result.current.openItinerary()

      expect(beforeNavigate).toHaveBeenCalledTimes(1)
    })

    it('should not call beforeNavigate', () => {
      const beforeNavigate = jest.fn()

      const { result } = renderHook(() => useOpenItinerary(undefined, beforeNavigate))
      result.current.openItinerary()

      expect(beforeNavigate).not.toHaveBeenCalled()
    })
  })

  describe('canOpenItinerary', () => {
    it('should return true', () => {
      const { result } = renderHook(() => useOpenItinerary('0.45, 1.45'))

      expect(result.current.canOpenItinerary).toBe(true)
    })

    it.each<[string, string | undefined | null]>([
      ['address is undefined', undefined],
      ['address is null', null],
    ])('should return false when %s', (_reason, address) => {
      const { result } = renderHook(() => useOpenItinerary(address))

      expect(result.current.canOpenItinerary).toBe(false)
    })
  })
})
