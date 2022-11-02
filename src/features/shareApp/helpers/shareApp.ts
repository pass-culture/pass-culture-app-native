import { WEBAPP_V2_URL } from 'libs/environment'
import { share } from 'libs/share'

const url = WEBAPP_V2_URL + '/accueil?utm_campaign=partage_app&utm_source=batch&utm_medium=app'
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
