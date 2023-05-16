import DeviceInfo from 'react-native-device-info'

import {
  DeviceInformation,
  useDeviceInfo,
} from 'features/profile/helpers/TrustedDevices/useDeviceInfo'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('react-native-device-info')

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
      id: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      source: 'iPhone 13',
      os: 'iOS',
    }

    await waitFor(() => {
      expect(result.current).toMatchObject(expectedInfo)
    })
  })

  it('returns informations about the device for web', async () => {
    reactNativeDetectMock.browserName = 'Chrome'
    getModelSpy.mockReturnValueOnce('unknown')
    getSystemNameSpy.mockReturnValueOnce('unknown')
    getBaseOsSpy.mockResolvedValueOnce('Mac OS')
    const { result } = renderHook(useDeviceInfo)

    const expectedInfo: DeviceInformation = {
      id: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      source: 'Chrome',
      os: 'Mac OS',
    }

    await waitFor(() => {
      expect(result.current).toMatchObject(expectedInfo)
    })
  })
})
