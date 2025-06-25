import DeviceInfo from 'react-native-device-info'

import { DeviceInformation, useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { act, renderHook } from 'tests/utils/web'

jest.mock('react-native-device-info')
jest.mock('libs/react-native-device-info/getDeviceId')

jest.spyOn(DeviceInfo, 'getModel')
jest.spyOn(DeviceInfo, 'getBaseOs')
jest.spyOn(DeviceInfo, 'getSystemName')

jest.mock('react-device-detect', () => ({ browserName: 'Chrome' }))

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  return { ...RN, useWindowDimensions: jest.fn(() => ({ width: 700, height: 1000 })) }
})

describe('useDeviceInfo', () => {
  it('returns informations about the device for web', async () => {
    const { result } = renderHook(useDeviceInfo)

    const expectedInfo: DeviceInformation = {
      deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      source: 'Chrome',
      os: 'unknown',
      fontScale: 1,
      screenZoomLevel: 1,
      resolution: '700x1000',
    }
    await act(async () => {})

    expect(result.current).toMatchObject(expectedInfo)
  })
})
