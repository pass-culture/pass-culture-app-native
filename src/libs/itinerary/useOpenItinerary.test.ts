import { renderHook } from '@testing-library/react-hooks'
import { AppEnum } from 'react-native-launch-navigator/enum'

import * as Itinerary from 'libs/itinerary/useItinerary'

import useOpenItinerary from './useOpenItinerary'

describe('useOpenItinerary', () => {
  describe('beforeNavigate', () => {
    it('should call beforeNavigate', () => {
      const useItinerary = jest
        .spyOn(Itinerary, 'useItinerary')
        .mockReturnValue({ availableApps: [AppEnum.WAZE], navigateTo: jest.fn() })
      const beforeNavigate = jest.fn()

      const { result } = renderHook(() => useOpenItinerary(0.45, 1.45, beforeNavigate))
      result.current.openItinerary()

      expect(beforeNavigate).toBeCalled()
      useItinerary.mockRestore()
    })
    it.each([
      [0.45, undefined],
      [undefined, 0.45],
    ])('should not call beforeNavigate', (lat, lng) => {
      const useItinerary = jest
        .spyOn(Itinerary, 'useItinerary')
        .mockReturnValue({ availableApps: [AppEnum.WAZE], navigateTo: jest.fn() })
      const beforeNavigate = jest.fn()

      const { result } = renderHook(() => useOpenItinerary(lat, lng, beforeNavigate))
      result.current.openItinerary()

      expect(beforeNavigate).not.toBeCalled()
      useItinerary.mockRestore()
    })
  })
  describe('canOpenItinerary', () => {
    it('should return true', () => {
      const useItinerary = jest
        .spyOn(Itinerary, 'useItinerary')
        .mockReturnValue({ availableApps: [AppEnum.WAZE], navigateTo: jest.fn() })

      const { result } = renderHook(() => useOpenItinerary(0.45, 1.45))

      expect(result.current.canOpenItinerary).toBe(true)

      useItinerary.mockRestore()
    })
    it.each<[string, [number | undefined, number | undefined, AppEnum[] | undefined]]>([
      ['latitude not defined', [undefined, 0.456, [AppEnum.WAZE]]],
      ['longitude not defined', [0.456, undefined, [AppEnum.WAZE]]],
      ['availableApps not defined', [0.456, 0.321, undefined]],
    ])('should return false when %s', (_reason, context) => {
      const [lat, lng, availableApps] = context
      const useItinerary = jest
        .spyOn(Itinerary, 'useItinerary')
        .mockReturnValue({ availableApps, navigateTo: jest.fn() })

      const { result } = renderHook(() => useOpenItinerary(lat, lng))

      expect(result.current.canOpenItinerary).toBe(false)
      useItinerary.mockRestore()
    })
  })
})
