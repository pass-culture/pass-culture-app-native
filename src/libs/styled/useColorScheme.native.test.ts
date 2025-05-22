import ReactNative from 'react-native'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { renderHook } from 'tests/utils'

import { useColorScheme, colorSchemeActions, ColorScheme } from './useColorScheme'

jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue(ColorScheme.LIGHT)

describe('useColorScheme', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('default', () => {
    it('display default to light mode', () => {
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.LIGHT)
    })

    it('display default to light mode when feature flag disable', () => {
      setFeatureFlags()
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.LIGHT)
    })
  })

  describe('user choice', () => {
    it('display dark mode when the user selects dark', () => {
      colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.DARK })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.DARK)
    })

    it('display light mode when the user selects light', () => {
      colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.LIGHT })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.LIGHT)
    })

    it('follows system theme when user selects system and system is light', () => {
      colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.SYSTEM })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.LIGHT)
    })

    it('follows system theme when user selects system and system is dark', () => {
      jest.spyOn(ReactNative, 'useColorScheme').mockReturnValueOnce(ColorScheme.DARK)
      colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.SYSTEM })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.DARK)
    })

    it('display light mode when system is dark but feature flag is disable', () => {
      setFeatureFlags()
      jest.spyOn(ReactNative, 'useColorScheme').mockReturnValueOnce(ColorScheme.DARK)
      colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.SYSTEM })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorScheme.LIGHT)
    })
  })
})
