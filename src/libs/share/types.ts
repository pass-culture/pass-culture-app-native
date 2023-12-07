export enum RNShareNetwork {
  googleMessages = 'SMS',
  instagram = 'Instagram',
  messenger = 'Messenger',
  snapchat = 'Snapchat',
  telegram = 'Telegram',
  twitter = 'Twitter',
  viber = 'Viber',
  whatsapp = 'WhatsApp',
}
export type ShareContent = {
  url: string
  body: string
  subject?: string
}
export type ShareMode = 'default' | 'iMessage' | `${RNShareNetwork}`
