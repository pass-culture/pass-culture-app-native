import { Platform } from 'react-native'

import { APPIUM_ADDRESS, APPIUM_ADDRESS_ANDROID } from 'libs/e2e/constants'
import { fetchWithTimeout } from 'libs/e2e/fetchWithTimeout'
import { env } from 'libs/environment'

// iOS/Android e2e test run on Emulator/Simulator with an Appium server
let isE2e: boolean | null = null

export async function getIsE2e() {
  if (env.ENV === 'production' || process.env.NODE_ENV === 'test') {
    isE2e = false
  }
  if (isE2e === true || isE2e === false) {
    return isE2e
  }
  try {
    const url = `${Platform.OS === 'android' ? APPIUM_ADDRESS_ANDROID : APPIUM_ADDRESS}/status`
    const response = await fetchWithTimeout(url, {
      mode: 'cors',
      headers: new Headers({
        accept: 'application/json',
      }),
    })
    isE2e = response.ok
  } catch {
    isE2e = false
  }
  return isE2e
}
