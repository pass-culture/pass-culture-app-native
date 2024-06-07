import DeviceInfo from 'react-native-device-info'

import { DeviceInformation, useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { act, renderHook } from 'tests/utils'

jest.mock('react-native-device-info')
jest.mock('libs/react-native-device-info/getDeviceId')

const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getBaseOsSpy = jest.spyOn(DeviceInfo, 'getBaseOs')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')
jest.mock('react-device-detect', () => ({ browserName: undefined }))
const reactNativeDetectMock = jest.requireMock('react-device-detect')

describe('useDeviceInfo', () => {
  it('returns informations about the device for an iPhone', async () => {
    getModelSpy.mockReturnValueOnce('iPhone 13')
    getBaseOsSpy.mockResolvedValueOnce('unknown')
    getSystemNameSpy.mockReturnValueOnce('iOS')
    const { result } = renderHook(useDeviceInfo)

    const expectedInfo: DeviceInformation = {
      deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      source: 'iPhone 13',
      os: 'iOS',
    }
    await act(async () => {})

    expect(result.current).toMatchObject(expectedInfo)
  })

  it('returns informations about the device for web', async () => {
    reactNativeDetectMock.browserName = 'Chrome'
    getModelSpy.mockReturnValueOnce('unknown')
    getSystemNameSpy.mockReturnValueOnce('unknown')
    getBaseOsSpy.mockResolvedValueOnce('Mac OS')
    const { result } = renderHook(useDeviceInfo)

    const expectedInfo: DeviceInformation = {
      deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      source: 'Chrome',
      os: 'Mac OS',
    }
    await act(async () => {})

    expect(result.current).toMatchObject(expectedInfo)
  })
})
