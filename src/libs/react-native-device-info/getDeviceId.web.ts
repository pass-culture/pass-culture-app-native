import { v4 as uuidv4 } from 'uuid'

import { storage } from 'libs/storage'

export async function getDeviceId() {
  try {
    const deviceIdFromStorage = await storage.readString('device_id')
    if (deviceIdFromStorage) return deviceIdFromStorage

    const newDeviceId = uuidv4()
    await storage.saveString('device_id', newDeviceId)
    return newDeviceId
  } catch (error) {
    return ''
  }
}
