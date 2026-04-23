import { getDeviceInfo } from 'features/trustedDevice/helpers/getDeviceInfo'

jest.mock('libs/react-native-device-info/getDeviceId')

describe('getDeviceInfo', () => {
  it('returns informations about the device', async () => {
    const result = await getDeviceInfo()

    const expectedInfo = {
      deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      source: 'iPhone 13',
      os: 'iOS',
    }

    expect(result).toMatchObject(expectedInfo)
  })
})
