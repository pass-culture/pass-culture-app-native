import { useEffect } from 'react'
import { Linking } from 'react-native'

import {
  ADJUST_LINK_PREFIX,
  PASS_CULTURE_PREFIX_URL,
} from 'features/navigation/navigators/RootNavigator/linking/linking'
import { Adjust } from 'libs/adjust/adjust'

// Only the links an Adjust campaign can open the app with: the others (password reset, email validation...) may carry personal data
const isAdjustCampaignLink = (url: string) =>
  url.startsWith(ADJUST_LINK_PREFIX) || url.startsWith(PASS_CULTURE_PREFIX_URL)

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
