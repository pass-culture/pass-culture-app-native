import { share } from 'libs/share'
import { shareAppContent } from 'libs/share/shareApp/shareAppContent'

const shareOptions = {
  subject: shareAppContent.title, // iOS only
  dialogTitle: shareAppContent.title, // android only
}

export const shareApp = () => share(shareAppContent, shareOptions)
