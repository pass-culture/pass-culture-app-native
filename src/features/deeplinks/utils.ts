import { env } from 'libs/environment'

export const UNIVERSAL_LINK = `https://${env.UNIVERSAL_LINK}/`

/**
 * WARNING: Avant de modifier cette constante critique, valider avec le backend qui
 * est à l'origine de ce format
 * WARNING: Variable supprimée à la fin du POC sur les universal links
 */
export const DEEP_LINK = `${env.URL_PREFIX}://app.${env.URL_PREFIX}.${env.ENV}/`

// Now we use universal link instead of deeplink. When installation ready, remove DEEP_LINK constante
export const DEEPLINK_DOMAIN = UNIVERSAL_LINK
