import { APPIUM_ADDRESS } from 'libs/e2e/constants'
import { env } from 'libs/environment'

let isE2e: boolean | undefined = undefined

export async function getIsE2e() {
  if (env.ENV === 'production' || process.env.NODE_ENV === 'test') {
    isE2e = false
  }
  if (isE2e === true || isE2e === false) {
    return isE2e
  }
  // Read more: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/webdriver
  if (globalThis.navigator.webdriver) {
    isE2e = globalThis.navigator.webdriver
  } else {
    // This alternative is specific for iOS browser as safaridriver ios have a bug and do not set navigator.webdriver property during automation
    try {
      const url = `${APPIUM_ADDRESS}/status`
      const response = await fetch(url, {
        mode: 'cors',
        headers: new Headers({
          accept: 'application/json',
        }),
      })
      isE2e = response.ok
    } catch {
      isE2e = false
    }
  }
  return isE2e
}
