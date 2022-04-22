import { Linking } from 'react-native'

export function subscribe(listener: (deeplink: string) => void) {
  const onReceiveURL = ({ url }: { url: string }) => listener(url)
  const subscription = Linking.addEventListener('url', onReceiveURL)

  return () => {
    subscription.remove()
  }
}
