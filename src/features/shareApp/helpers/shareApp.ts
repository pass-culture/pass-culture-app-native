import { share } from 'libs/share'

const url = 'https://passculture.onelink.me/SmRf/xthbokjg'
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
