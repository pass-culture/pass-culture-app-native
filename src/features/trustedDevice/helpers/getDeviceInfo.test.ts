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
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns informations about the device', async () => {
    const result = await getDeviceInfo()

    expect(result).toMatchObject({
      deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      source: 'iPhone 13',
      os: 'iOS',
    })
  })

  it('returns cached result on second call', async () => {
    const result1 = await getDeviceInfo()
    const result2 = await getDeviceInfo()

    expect(result1).toBe(result2) //same object reference
  })

  it('should only call getDeviceId once', () => {
    jest.isolateModules(() => {
      const { getDeviceId } = jest.requireMock('libs/react-native-device-info/getDeviceId')
      const { getDeviceInfo: getDeviceInfoModule } = jest.requireActual(
        'features/trustedDevice/helpers/getDeviceInfo'
      )

      return getDeviceInfoModule()
        .then(() => getDeviceInfoModule())
        .then(() => getDeviceInfoModule())
        .then(() => expect(getDeviceId).toHaveBeenCalledTimes(1))
    })
  })
})
