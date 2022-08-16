import { WEBAPP_V2_URL } from 'libs/environment'
import dynamicLinks from 'libs/firebase/shims/dynamic-links'
import { BatchPush } from 'libs/react-native-batch'

// Override of default `getInitialURL` of `linking` config required to make
// firebase dynamic links work on iOS :
// See: https://medium.com/tribalscale/working-with-react-navigation-v5-firebase-cloud-messaging-and-firebase-dynamic-links-f8580c3b83ad
export async function getInitialURL(): Promise<string> {
  const dynamicLinkUrl = await dynamicLinks().getInitialLink()
  if (dynamicLinkUrl) {
    return dynamicLinkUrl.url
  }
  // Little break for react-navigation loading
  // Issue opened to remove it : https://github.com/react-navigation/react-navigation/issues/10752
  // TODO(PC-16812): https://passculture.atlassian.net/browse/PC-16812
  await new Promise((r) => setTimeout(r, 500))
  const url = await BatchPush.getInitialURL()
  if (url) {
    return url
  }
  return WEBAPP_V2_URL
}
