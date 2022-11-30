import { flags } from './platform'

export const logEvent = (vendor: string, event: string) => {
  if (flags.isAndroid || flags.isIOS) {
    driver.logEvent(vendor, event)
  } else {
    console.log(new Date().toISOString(), 'INFO', vendor, event)
  }
}
