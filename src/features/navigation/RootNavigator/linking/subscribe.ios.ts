import { Linking } from 'react-native'

import dynamicLinks, { FirebaseDynamicLinksTypes } from 'libs/firebase/dynamic-links'

// Override of default `subscribe` of `linking` config required to make
// firebase dynamic links work on iOS :
// See: https://medium.com/tribalscale/working-with-react-navigation-v5-firebase-cloud-messaging-and-firebase-dynamic-links-f8580c3b83ad
export function subscribe(listener: (deeplink: string) => void) {
  // Default deeplink handling
  const onReceiveURL = ({ url }: { url: string }) => listener(url)
  const subscription = Linking.addEventListener('url', onReceiveURL)

  // Dynamic links
  const handleDynamicLink = (dynamicLink: FirebaseDynamicLinksTypes.DynamicLink) => {
    listener(dynamicLink.url)
  }
  const unsubscribeToDynamicLinks = dynamicLinks().onLink(handleDynamicLink)

  return () => {
    unsubscribeToDynamicLinks()
    subscription.remove()
  }
}
