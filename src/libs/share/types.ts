export enum Network {
  googleMessages = 'SMS',
  instagram = 'Instagram',
  messenger = 'Messenger',
  snapchat = 'Snapchat',
  telegram = 'Telegram',
  twitter = 'Twitter',
  viber = 'Viber',
  whatsapp = 'WhatsApp',
  imessage = 'iMessage',
}

export type ShareContent = {
  url: URL
  body: string
  subject?: string
}

export type ShareMode = 'default' | `${Network}`
