import { env } from 'libs/environment/env'

export const logoutFromEduConnectIfAllowed = (logoutUrl: string | undefined) => {
  if (logoutUrl && new RegExp(`^${env.EDUCONNECT_ALLOWED_DOMAIN}`, 'i').test(logoutUrl)) {
    globalThis.window.open(logoutUrl)
  }
}
