import { useEffect } from 'react'
import { Linking } from 'react-native'

import {
  ADJUST_LINK_PREFIX,
  PASS_CULTURE_PREFIX_URL,
} from 'features/navigation/navigators/RootNavigator/linking/linking'
import { Adjust } from 'libs/adjust/adjust'

// The links of an Adjust campaign carry its tracker (`adj_t`, `adjust_t` in older links): the full click URL of an Adjust deep link,
// and the link Adjust opens the app with through the custom scheme
const ADJUST_TRACKER_PARAM = /[?&](adj_t|adjust_t)=[^&#]/

// Only the links of an Adjust campaign: every screen of the app can be opened with these prefixes, including the ones whose link
// carries a token and an email (password reset, email validation...), which must not be sent to Adjust
const isAdjustCampaignLink = (url: string) =>
  (url.startsWith(ADJUST_LINK_PREFIX) || url.startsWith(PASS_CULTURE_PREFIX_URL)) &&
  ADJUST_TRACKER_PARAM.test(url)

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
