/**
 * This will work with any version of Safari across all devices: Mac, iPhone, iPod, iPad.
 * Taken from https://stackoverflow.com/a/31732310/2127277
 */
export function isSafari() {
  const { navigator } = globalThis
  return (
    navigator?.vendor?.includes('Apple') &&
    !navigator?.userAgent?.includes('CriOS') &&
    !navigator?.userAgent?.includes('FxiOS')
  )
}
