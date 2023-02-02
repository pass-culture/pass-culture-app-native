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
    // Also, we will wait a bit more, because we inject window.webdriver and it can take time, this is not a problem as we already wait 5sec before starting a suite.
    await new Promise((resolve) => setTimeout(resolve, 5000))
    isE2e = !!globalThis.window.webdriver
  }
  return isE2e
}
