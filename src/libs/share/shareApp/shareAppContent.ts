import { t } from '@lingui/macro'
import { Platform } from 'react-native'

import { env } from 'libs/environment'

const isIos = Platform.OS === 'ios'
const isAndroid = Platform.OS === 'android'

const url = isIos
  ? env.APPLE_STORE_URL
  : isAndroid
  ? env.GOOGLE_PLAY_STORE_URL
  : env.PASSCULTURE_DOWNLOAD_APP_URL

export const shareAppContent = {
  title: t`Partage le lien d’invitation`,
  message: t`Profite toi aussi de tous les bons plans du pass Culture`,
  url,
}
