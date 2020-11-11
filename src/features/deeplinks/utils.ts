import { env } from 'libs/environment'

export function formatDeeplinkDomain() {
  return `${env.URL_PREFIX}://app.${env.URL_PREFIX}.${env.ENV}/`
}
