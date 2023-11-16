import { APPIUM_ADDRESS } from 'libs/e2e/constants'
import { fetchWithTimeout } from 'libs/e2e/fetchWithTimeout'
import { env } from 'libs/environment'

let isE2e: boolean | undefined = undefined

export async function getIsE2e() {
  if (env.ENV === 'production' || process.env.NODE_ENV === 'test') {
    isE2e = false
  }
  if (isE2e === true || isE2e === false) {
    return isE2e
  }
  // This alternative is specific for iOS browser as safaridriver ios have a bug and do not set navigator.webdriver property during automation
  try {
    const url = `${APPIUM_ADDRESS}/status`
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
