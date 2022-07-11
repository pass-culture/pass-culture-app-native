import { renderHook } from 'tests/utils'

import { useIsLandscapePosition } from '../useIsLandscapePosition'

const reactDeviceMock = { isDesktopDeviceDetectOnWeb: false, isIOS: false }
jest.mock('libs/react-device-detect', () => reactDeviceMock)
jest.mock('react-device-detect', () => reactDeviceMock)

const windowSize = { width: 400, height: 800 }
const screenSize = { width: 400, height: 800 }
jest.mock('@react-native-community/hooks', () => ({
  useDimensions: () => ({
    screen: screenSize,
    window: windowSize,
  }),
}))

describe('useIsLandscapePosition', () => {
  it('should always be false for desktop device', () => {
    reactDeviceMock.isDesktopDeviceDetectOnWeb = true
    const { result } = renderHook(useIsLandscapePosition)
    expect(result.current).toBeFalsy()
  })

  describe('iOS device', () => {
    it('should always use window instead of screen for iOS devices', () => {
      reactDeviceMock.isDesktopDeviceDetectOnWeb = false
      reactDeviceMock.isIOS = true
      // To ensure we have opposite result if screen is used instead of window
      screenSize.width = windowSize.height
      screenSize.height = windowSize.width
      const { result } = renderHook(useIsLandscapePosition)
      expect(result.current).toBeFalsy()
    })

    it('should be true if window width is larger than window height', () => {
      reactDeviceMock.isDesktopDeviceDetectOnWeb = false
      reactDeviceMock.isIOS = true

      windowSize.width = 800
      windowSize.height = 400
      const { result } = renderHook(useIsLandscapePosition)
      expect(result.current).toBeTruthy()
    })

    it('should be false if window width is smaller than window height', () => {
      reactDeviceMock.isDesktopDeviceDetectOnWeb = false
      reactDeviceMock.isIOS = true

      windowSize.width = 400
      windowSize.height = 800
      const { result } = renderHook(useIsLandscapePosition)
      expect(result.current).toBeFalsy()
    })
  })

  describe('Non-iOS device', () => {
    it('should always use screen instead of window for non iOS devices', () => {
      reactDeviceMock.isDesktopDeviceDetectOnWeb = false
      reactDeviceMock.isIOS = false
      // To ensure we have opposite result if screen is used instead of window
      windowSize.height = screenSize.width
      windowSize.width = screenSize.height
      const { result } = renderHook(useIsLandscapePosition)
      expect(result.current).toBeTruthy()
    })

    it('should be true if screen width is larger than screen height', () => {
      reactDeviceMock.isDesktopDeviceDetectOnWeb = false
      reactDeviceMock.isIOS = false

      screenSize.width = 800
      screenSize.height = 400
      const { result } = renderHook(useIsLandscapePosition)
      expect(result.current).toBeTruthy()
    })

    it('should be false if screen width is smaller than screen height', () => {
      reactDeviceMock.isDesktopDeviceDetectOnWeb = false
      reactDeviceMock.isIOS = false

      screenSize.width = 400
      screenSize.height = 800
      const { result } = renderHook(useIsLandscapePosition)
      expect(result.current).toBeFalsy()
    })
  })
})
