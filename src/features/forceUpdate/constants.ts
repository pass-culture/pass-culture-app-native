import { Platform } from 'react-native'

import { env } from 'libs/environment'

const ANDROID_STORE_LINK = `https://play.google.com/store/apps/details?id=${env.ANDROID_APP_ID}`
const IOS_STORE_LINK = `https://apps.apple.com/fr/app/pass-culture/id${env.IOS_APP_STORE_ID}`

export const STORE_LINK = Platform.select({
  ios: IOS_STORE_LINK,
  android: ANDROID_STORE_LINK,
  default: ANDROID_STORE_LINK,
})

export const TITLE = Platform.select({
  default: 'Mise à jour de l’application',
  web: 'Mise à jour de l’application',
})

export const DESCRIPTION = Platform.select({
  default:
    'Le pass Culture ne semble plus à jour sur ton téléphone\u00a0! Pour des questions de performance et de sécurité merci de télécharger la dernière version disponible.',
  web: 'Le pass Culture de ton navigateur ne semble plus à jour\u00a0! Pour des questions de performance et de sécurité merci d’actualiser la page pour obtenir la dernière version disponible.',
})

export const BUTTON_TEXT = Platform.select({
  default: 'Télécharger la dernière version',
  web: 'Actualiser la page',
})
