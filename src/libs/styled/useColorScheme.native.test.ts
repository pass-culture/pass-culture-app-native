import ReactNative from 'react-native'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { renderHook } from 'tests/utils'

import { ColorScheme, colorSchemeActions, useColorScheme } from './useColorScheme'

const useColorSchemeSpy = jest.spyOn(ReactNative, 'useColorScheme')
useColorSchemeSpy.mockReturnValue(ColorScheme.LIGHT)

const setColorSchemeSpy = jest.spyOn(colorSchemeActions, 'setColorScheme')

describe('useColorScheme', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('default', () => {
    it('should return default to light mode', () => {
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.LIGHT)
    })

    it('should not write to store on first render', () => {
      renderHook(() => useColorScheme())

      expect(setColorSchemeSpy).not.toHaveBeenCalled()
    })

    it('should return default to light mode when feature flag disable', () => {
      setFeatureFlags()
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.LIGHT)
    })

    it('should not set default to system theme when feature flag disable', () => {
      setFeatureFlags()
      renderHook(() => useColorScheme())

      expect(setColorSchemeSpy).not.toHaveBeenCalled()
    })
  })

  describe('user choice', () => {
    it('should return dark mode when the user selects dark', () => {
      colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.DARK })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.DARK)
    })

    it('should return light mode when the user selects light', () => {
      colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.LIGHT })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.LIGHT)
    })

    it('should follows system theme when user selects system and system is light', () => {
      colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.SYSTEM })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.LIGHT)
    })

    it('should follows system theme when user selects system and system is dark', () => {
      useColorSchemeSpy.mockReturnValueOnce(ColorScheme.DARK)
      colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.SYSTEM })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.DARK)
    })

    it('should return light mode when system is dark but feature flag is disable', () => {
      setFeatureFlags()
      useColorSchemeSpy.mockReturnValueOnce(ColorScheme.DARK)
      colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.SYSTEM })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.LIGHT)
    })
  })
})
