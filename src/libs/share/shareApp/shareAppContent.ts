import { Platform } from 'react-native'

import { WEBAPP_V2_URL } from 'libs/environment'

const url = WEBAPP_V2_URL + '/accueil?utm_campaign=partage_app&utm_source=batch&utm_medium=app'
const message = `Profite toi aussi de tous les bons plans du pass Culture\u00a0: ${
  Platform.OS === 'web' ? '' : `\n${url}`
}`

export const shareAppContent = {
  title: 'Profite toi aussi de tous les bons plans du pass Culture',
  message,
  url: Platform.OS === 'web' ? url : undefined,
}
