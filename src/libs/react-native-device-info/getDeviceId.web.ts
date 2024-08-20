import { v4 as uuidv4 } from 'uuid'

import { eventMonitoring } from 'libs/monitoring'
import { storage } from 'libs/storage'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

const DEVICE_ID_KEY = 'device_id'
const NEW_DEVICE_ID = uuidv4()

export async function getDeviceId() {
  try {
    const deviceIdFromStorage = await storage.readString(DEVICE_ID_KEY)
    if (deviceIdFromStorage) return deviceIdFromStorage

    try {
      await storage.saveString(DEVICE_ID_KEY, NEW_DEVICE_ID)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      eventMonitoring.captureException(`Error when save device ID in storage: ${errorMessage}`, {
        extra: { error },
      })
      return ''
    }
    return NEW_DEVICE_ID
  } catch (error) {
    return NEW_DEVICE_ID
  }
}
