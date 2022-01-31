import { Platform, Share } from 'react-native'

export type ShareContent = {
  title?: string
  message: string
  url: string
}

type ShareOptions = Parameters<typeof Share.share>[1]

export async function share(content: ShareContent, options: ShareOptions): Promise<void> {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // The only place where it's ok to deactivate the eslint rule is here.
    // Never use Share.share() outside this module.
    // eslint-disable-next-line no-restricted-properties
    await Share.share(content, options)
  }
  // On web, the share feature is supported by the WebShareModal component.
}
