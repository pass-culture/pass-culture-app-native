import { env } from 'libs/environment'

/**
 * WARNING: Avant de modifier cette constante critique, valider avec le backend qui
 * est à l'origine de ce format
 */
export const DEEPLINK_DOMAIN = `${env.URL_PREFIX}://app.${env.URL_PREFIX}.${env.ENV}/`
