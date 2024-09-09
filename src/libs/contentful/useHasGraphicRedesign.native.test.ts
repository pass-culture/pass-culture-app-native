import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { renderHook } from 'tests/utils'

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('useHasGraphicRedesign', () => {
  describe('When shouldApplyGraphicRedesign remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldApplyGraphicRedesign: false,
      })
    })

    it('should return false when homeId is in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is true', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: true, homeId: '4XbgmX7fVVgBMoCJiLiY9n' })
      )

      expect(result.current).toEqual(false)
    })

    it('should return false when homeId is in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is false', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: false, homeId: '4XbgmX7fVVgBMoCJiLiY9n' })
      )

      expect(result.current).toEqual(false)
    })

    it('should return true when homeId is not in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is true', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: true, homeId: 'test' })
      )

      expect(result.current).toEqual(true)
    })
  })

  describe('When shouldApplyGraphicRedesign remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldApplyGraphicRedesign: true,
      })
    })

    it('should return true when homeId is in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is true', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: true, homeId: '4XbgmX7fVVgBMoCJiLiY9n' })
      )

      expect(result.current).toEqual(true)
    })

    it('should return false when homeId is in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is false', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: false, homeId: '4XbgmX7fVVgBMoCJiLiY9n' })
      )

      expect(result.current).toEqual(false)
    })

    it('should return true when homeId is not in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is true', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: true, homeId: 'test' })
      )

      expect(result.current).toEqual(true)
    })
  })
})
