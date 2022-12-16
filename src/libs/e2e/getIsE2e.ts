import { APPIUM_ADDRESS } from 'libs/e2e/constants'

// iOS/Android e2e test run on Emulator/Simulator with an Appium server
export async function getIsE2e() {
  try {
    const response = await fetch(`${APPIUM_ADDRESS}/status`)
    return response.ok
  } catch (error) {
    return false
  }
}
