import { WEBAPP_V2_URL } from 'libs/environment'
import { share } from 'libs/share'

const shareAppTitle = 'Profite toi aussi de tous les bons plans du pass Culture'

const shareOptions = {
  subject: shareAppTitle, // iOS only
  dialogTitle: shareAppTitle, // android only
}

export const shareApp = (utmMedium: string) => {
  const url = `${WEBAPP_V2_URL}/accueil`
  const urlWithUtmParams = `${url}?utm_campaign=share_app&utm_medium=${utmMedium}`
  const messageWithoutLink = 'Profite toi aussi de tous les bons plans du pass Culture'
  const message = `${messageWithoutLink}\u00a0: \n${urlWithUtmParams}`

  const shareAppContent = {
    title: shareAppTitle,
    message,
    messageWithoutLink,
  }
  return share(shareAppContent, shareOptions, true)
}
