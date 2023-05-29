import { getDeviceId } from 'libs/react-native-device-info/getDeviceId.web'
import { storage } from 'libs/storage'

jest.unmock('libs/react-native-device-info/getDeviceId')

const DEVICE_ID_FROM_UUID = 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a'
const DEVICE_ID_FROM_STORAGE = '1234-abcd-5678-efgh'

describe('getDeviceId', () => {
  beforeEach(() => storage.clear('device_id'))

  it('should return the device ID from local storage if present', async () => {
    storage.saveString('device_id', DEVICE_ID_FROM_STORAGE)
    const deviceId = await getDeviceId()

    expect(deviceId).toEqual(DEVICE_ID_FROM_STORAGE)
  })

  it('should generate a new device ID if no device ID present in the storage', async () => {
    const deviceId = await getDeviceId()

    expect(deviceId).toEqual(DEVICE_ID_FROM_UUID)
  })

  it('should store the new device ID in the storage if not present', async () => {
    await getDeviceId()

    const deviceIdStorageAfter = await storage.readString('device_id')
    expect(deviceIdStorageAfter).toEqual(DEVICE_ID_FROM_UUID)
  })

  it('should handle errors and return an empty string as a default device ID', async () => {
    const error = new Error('READING_REJECTED')
    jest.spyOn(storage, 'readString').mockRejectedValueOnce(error)
    const deviceId = await getDeviceId()

    expect(deviceId).toEqual('')
  })
})
