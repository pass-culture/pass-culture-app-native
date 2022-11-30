import { Capabilities } from '@wdio/types/build/Capabilities'

function getIsWeb() {
  const { browserName } = driver.capabilities as Capabilities
  return !!browserName
}

function getIsSafari() {
  const { browserName, platformName } = driver.capabilities as Capabilities
  return browserName === 'safari' && platformName !== 'ios'
}

export const flags = {
  isAndroid: driver.isAndroid,
  isIOS: driver.isIOS,
  isWeb: getIsWeb(),
  // below flags concerns desktop only (always false on iOS and Android)
  isChrome: driver.isChrome,
  isFirefox: driver.isFirefox,
  isSafari: getIsSafari(),
}
