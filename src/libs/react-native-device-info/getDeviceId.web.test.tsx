import { v4 as uuidv4 } from 'uuid'

import { eventMonitoring } from 'libs/monitoring'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId.web'
import { storage } from 'libs/storage'

jest.unmock('libs/react-native-device-info/getDeviceId')

const DEVICE_ID_KEY = 'device_id'
const DEVICE_ID_FROM_UUID = uuidv4()
const DEVICE_ID_FROM_STORAGE = '1234-abcd-5678-efgh'

describe('getDeviceId', () => {
  beforeEach(() => storage.clear(DEVICE_ID_KEY))

  it('should return the device ID from local storage if present', async () => {
    storage.saveString(DEVICE_ID_KEY, DEVICE_ID_FROM_STORAGE)
    const deviceId = await getDeviceId()

    expect(deviceId).toEqual(DEVICE_ID_FROM_STORAGE)
  })

  it('should generate a new device ID if no device ID present in the storage', async () => {
    const deviceId = await getDeviceId()

    expect(deviceId).toEqual(DEVICE_ID_FROM_UUID)
  })

  it('should store the new device ID in the storage if not present', async () => {
    await getDeviceId()

    const deviceIdStorageAfter = await storage.readString(DEVICE_ID_KEY)

    expect(deviceIdStorageAfter).toEqual(DEVICE_ID_FROM_UUID)
  })

  it('should return an empty string when an error appear on saving device ID in storage', async () => {
    const error = new Error('SAVING_REJECTED')
    jest.spyOn(storage, 'saveString').mockRejectedValueOnce(error)
    const deviceId = await getDeviceId()

    expect(deviceId).toEqual('')
  })

  it('should capture an exception when an error appear on saving device ID in storage', async () => {
    const error = new Error('SAVING_REJECTED')
    jest.spyOn(storage, 'saveString').mockRejectedValueOnce(error)
    await getDeviceId()

    expect(eventMonitoring.captureException).toHaveBeenNthCalledWith(
      1,
      `Error when save device ID in storage: ${error}`
    )
  })

  it('should return a random device ID when an error appear on read device ID in storage', async () => {
    const error = new Error('READING_REJECTED')
    jest.spyOn(storage, 'readString').mockRejectedValueOnce(error)
    const deviceId = await getDeviceId()

    expect(deviceId).toEqual(DEVICE_ID_FROM_UUID)
  })
})
