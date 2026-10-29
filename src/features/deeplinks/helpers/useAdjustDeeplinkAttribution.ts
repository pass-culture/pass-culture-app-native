import { useEffect } from 'react'
import { Linking } from 'react-native'

import {
  ADJUST_LINK_PREFIX,
  PASS_CULTURE_PREFIX_URL,
} from 'features/navigation/navigators/RootNavigator/linking/linking'
import { Adjust } from 'libs/adjust/adjust'

// Adjust adds its tracker (`adj_t`, `adjust_t` in older links) to the link it opens the app with through the custom scheme
const ADJUST_TRACKER_PARAM = /[?&](adj_t|adjust_t)=[^&#]/

// Only the links an Adjust campaign can open the app with: the others (password reset, email validation...) may carry personal data,
// including custom scheme links, which do not all come from Adjust
const isAdjustCampaignLink = (url: string) =>
  url.startsWith(ADJUST_LINK_PREFIX) ||
  (url.startsWith(PASS_CULTURE_PREFIX_URL) && ADJUST_TRACKER_PARAM.test(url))

const processAdjustCampaignLink = (url: string | null) => {
  if (url && isAdjustCampaignLink(url)) Adjust.processDeeplink(url)
}

// Lets Adjust attribute the opening of the app by a campaign link to that campaign, including for users who already have the app
export const useAdjustDeeplinkAttribution = () => {
  useEffect(() => {
    void Linking.getInitialURL().then(processAdjustCampaignLink)
    const subscription = Linking.addEventListener('url', ({ url }) =>
      processAdjustCampaignLink(url)
    )

    return () => subscription.remove()
  }, [])
}
