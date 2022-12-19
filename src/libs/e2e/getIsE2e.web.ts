export async function getIsE2e() {
  // Read more: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/webdriver
  if (globalThis.navigator.webdriver) {
    return globalThis.navigator.webdriver
  }
  // This alternative is specific for iOS browser as safaridriver ios have a bug and do not set navigator.webdriver property during automation
  // Also, we will wait a bit more, because we inject window.webdriver and it can take time, this is not a problem as we already wait 5sec before starting a suite.
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return !!globalThis.window.webdriver
}
