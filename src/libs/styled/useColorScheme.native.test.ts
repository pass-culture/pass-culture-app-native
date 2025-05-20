import ReactNative from 'react-native'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { renderHook } from 'tests/utils'

import { useColorScheme, colorSchemeActions, ColorSchemeEnum } from './useColorScheme'

jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue(ColorSchemeEnum.LIGHT)

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  RN.NativeModules.DefaultBrowserModule = { useColorScheme: jest.fn() }
  return RN
})

describe('useColorScheme', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('default', () => {
    it('should return light when feature flag is disabled', () => {
      setFeatureFlags([])
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorSchemeEnum.LIGHT)
    })

    it('should return light when feature flag is enable', () => {
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorSchemeEnum.LIGHT)
    })
  })

  describe('user choice', () => {
    it('should return dark when storedScheme=dark', () => {
      colorSchemeActions.setColorScheme({ colorScheme: ColorSchemeEnum.DARK })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorSchemeEnum.DARK)
    })

    it('should return light when storedScheme=light', () => {
      colorSchemeActions.setColorScheme({ colorScheme: ColorSchemeEnum.LIGHT })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorSchemeEnum.LIGHT)
    })

    it('should return light when storedScheme=system is light', () => {
      jest.spyOn(ReactNative, 'useColorScheme').mockReturnValueOnce(ColorSchemeEnum.LIGHT)
      colorSchemeActions.setColorScheme({ colorScheme: ColorSchemeEnum.SYSTEM })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorSchemeEnum.LIGHT)
    })

    it('should return dark when storedScheme=system is dark and colorScheme=dark', () => {
      jest.spyOn(ReactNative, 'useColorScheme').mockReturnValueOnce(ColorSchemeEnum.DARK)
      colorSchemeActions.setColorScheme({ colorScheme: ColorSchemeEnum.SYSTEM })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorSchemeEnum.DARK)
    })

    it('should return dark when storedScheme=system is dark but feature flag is disabled', () => {
      setFeatureFlags([])
      jest.spyOn(ReactNative, 'useColorScheme').mockReturnValueOnce(ColorSchemeEnum.DARK)
      colorSchemeActions.setColorScheme({ colorScheme: ColorSchemeEnum.SYSTEM })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorSchemeEnum.LIGHT)
    })

    it('should return light when storedScheme=system is light and colorScheme=light', () => {
      jest.spyOn(ReactNative, 'useColorScheme').mockReturnValueOnce(ColorSchemeEnum.LIGHT)
      colorSchemeActions.setColorScheme({ colorScheme: ColorSchemeEnum.SYSTEM })
      const { result } = renderHook(() => useColorScheme())

      expect(result.current).toBe(ColorSchemeEnum.LIGHT)
    })
  })
})
