import { getAppVersion } from 'libs/packageJson'

export function useVersion() {
  return `Version\u00A0${getAppVersion()}`
}
