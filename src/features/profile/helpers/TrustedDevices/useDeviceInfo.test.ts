import DeviceInfo from 'react-native-device-info'

import {
  DeviceInformations,
  useDeviceInfos,
} from 'features/profile/helpers/TrustedDevices/useDeviceInfos'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('react-native-device-info')

const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getBrandSpy = jest.spyOn(DeviceInfo, 'getBrand')
const getBaseOsSpy = jest.spyOn(DeviceInfo, 'getBaseOs')

describe('useDeviceInfo', () => {
  it('returns informations about the device for an iPhone', async () => {
    getModelSpy.mockReturnValueOnce('iPhone 13')
    getBrandSpy.mockReturnValueOnce('Apple')
    getBaseOsSpy.mockResolvedValueOnce('unknown')
    const { result } = renderHook(useDeviceInfos)

    const expectedInfo: DeviceInformations = {
      deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      deviceBrand: 'Apple',
      deviceModel: 'iPhone 13',
    }

    await waitFor(() => {
      expect(result.current).toMatchObject(expectedInfo)
    })
  })

  it('returns informations about the device for web', async () => {
    getModelSpy.mockReturnValueOnce('unknown')
    getBrandSpy.mockReturnValueOnce('unknown')
    getBaseOsSpy.mockResolvedValueOnce('Mac OS')
    const { result } = renderHook(useDeviceInfos)

    const expectedInfo: DeviceInformations = {
      deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      deviceOS: 'Mac OS',
    }

    await waitFor(() => {
      expect(result.current).toMatchObject(expectedInfo)
    })
  })
})
