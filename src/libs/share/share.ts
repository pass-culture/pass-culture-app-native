import { Platform, Share } from 'react-native'

export function isShareApiSupported(): boolean {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return true
  }
  if (Platform.OS === 'web') {
    return true
  }
  return false
}

export type ShareContent = {
  title?: string | undefined
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
  if (Platform.OS === 'web') {
    // const { title, message, url } = content
    // await navigator.share(
    //   { title, text: message, url, hashtags: 'PassCulture' },
    //   WEB_DESKTOP_SHARE_API_OPTIONS
    // )
  }
}
