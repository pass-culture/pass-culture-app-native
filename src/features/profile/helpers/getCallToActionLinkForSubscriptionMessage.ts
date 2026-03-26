import { openInbox } from 'react-native-email-link'

import { SubscriptionMessage } from 'api/gen'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/helpers/matchSubscriptionMessageIconToSvg'
import { shouldOpenInbox as checkShouldOpenInbox } from 'features/profile/helpers/shouldOpenInbox'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

export const getCallToActionLinkForSubscriptionMessage = (
  subscriptionMessage: SubscriptionMessage,
  isMailAppAvailable: boolean
) => {
  const callToAction = subscriptionMessage.callToAction
  if (!callToAction || !callToAction.callToActionTitle || !callToAction.callToActionLink) return []

  const shouldOpenInbox = checkShouldOpenInbox(callToAction.callToActionLink)
  if (isMailAppAvailable && shouldOpenInbox) {
    return [
      {
        icon: matchSubscriptionMessageIconToSvg(callToAction.callToActionIcon, EmailFilled),
        wording: callToAction.callToActionTitle,
        onPress: openInbox,
      },
    ]
  }

  return [
    {
      icon: matchSubscriptionMessageIconToSvg(callToAction.callToActionIcon, ExternalSiteFilled),
      wording: callToAction.callToActionTitle,
      externalNav: { url: callToAction.callToActionLink },
    },
  ]
}
