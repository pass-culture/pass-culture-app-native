import dynamicLinks from '@react-native-firebase/dynamic-links'
import { Linking } from 'react-native'

import { WEBAPP_V2_URL } from 'libs/environment'

// Override of default `getInitialURL` of `linking` config required to make
// firebase dynamic links work on iOS :
// See: https://medium.com/tribalscale/working-with-react-navigation-v5-firebase-cloud-messaging-and-firebase-dynamic-links-f8580c3b83ad
export async function getInitialURL(): Promise<string> {
  const dynamicLinkUrl = await dynamicLinks().getInitialLink()
  if (dynamicLinkUrl) {
    return dynamicLinkUrl.url
  }
  const url = await Linking.getInitialURL()
  if (url) {
    return url
  }
  return WEBAPP_V2_URL
}
