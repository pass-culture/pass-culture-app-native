import { getDeviceInfo } from 'features/trustedDevice/helpers/getDeviceInfo'

jest.mock('libs/react-native-device-info/getDeviceId', () => ({
  getDeviceId: jest.fn(() => 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a'),
}))
jest.mock('react-native-device-info', () => ({
  getSystemName: jest.fn(() => 'iOS'),
  getModel: jest.fn(() => 'iPhone 13'),
  getBaseOs: jest.fn(() => Promise.resolve('iOS')),
  isLandscape: jest.fn(() => false),
}))

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
