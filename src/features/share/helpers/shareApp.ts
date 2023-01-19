import { env } from 'libs/environment'
import { share } from 'libs/share'

const testUrl =
  'https://app.testing.passculture.team/accueil?utm_campaign=test_growth&utm_source=in-app&utm_medium=in-app'
const url = env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING
  ? testUrl
  : 'https://passculture.onelink.me/SmRf/xthbokjg'

const message = `Profite toi aussi de tous les bons plans du pass Culture\u00a0: \n${url}`

const shareAppContent = {
  title: 'Profite toi aussi de tous les bons plans du pass Culture',
  message,
}

const shareOptions = {
  subject: shareAppContent.title, // iOS only
  dialogTitle: shareAppContent.title, // android only
}

export const shareApp = () => share(shareAppContent, shareOptions, true)
