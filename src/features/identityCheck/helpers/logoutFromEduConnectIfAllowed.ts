import { isValidEduConnectUrl } from 'shared/isValidUrl/isValidUrl'

export const logoutFromEduConnectIfAllowed = (logoutUrl: string | undefined) => {
  if (logoutUrl && isValidEduConnectUrl(logoutUrl)) {
    globalThis.window.open(logoutUrl)
  }
}
