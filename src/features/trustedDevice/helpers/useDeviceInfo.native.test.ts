import DeviceInfo from 'react-native-device-info'

import { DeviceInformation, useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { act, renderHook } from 'tests/utils'

jest.mock('react-native-device-info')
jest.mock('libs/react-native-device-info/getDeviceId')

const RESOLUTION_WIDTH = 700
const RESOLUTION_HEIGHT = 1000
const mockUseWindowDimensions = jest.fn().mockReturnValue({
  width: RESOLUTION_WIDTH,
  height: RESOLUTION_HEIGHT,
})
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: mockUseWindowDimensions,
}))

const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getBaseOsSpy = jest.spyOn(DeviceInfo, 'getBaseOs')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')
const getFontScaleSpy = jest.spyOn(DeviceInfo, 'getFontScale')
jest.mock('react-device-detect', () => ({ browserName: undefined }))

describe('useDeviceInfo', () => {
  it('returns informations about the device', async () => {
    getModelSpy.mockReturnValueOnce('iPhone 13')
    getBaseOsSpy.mockResolvedValueOnce('unknown')
    getSystemNameSpy.mockReturnValueOnce('iOS')
    getFontScaleSpy.mockResolvedValueOnce(1.5)

    const { result } = renderHook(useDeviceInfo)

    const expectedInfo: DeviceInformation = {
      deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      source: 'iPhone 13',
      os: 'iOS',
      resolution: '700x1000',
      fontScale: 1.5,
      screenZoomLevel: undefined,
    }
    await act(async () => {})

    expect(result.current).toMatchObject(expectedInfo)
  })
})
