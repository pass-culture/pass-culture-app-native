import React from 'react'

import { PopOverIcon, SubscriptionMessage } from 'api/gen'
import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { getCallToActionLinkForSubscriptionMessage } from 'features/profile/helpers/getCallToActionLinkForSubscriptionMessage'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/helpers/matchSubscriptionMessageIconToSvg'
import { Banner } from 'ui/designSystem/Banner/Banner'

const defaultSubscriptionMessage: SubscriptionMessage = {
  userMessage: 'Une demande est en cours de traitement',
  popOverIcon: PopOverIcon.INFO,
  callToAction: undefined,
}

export const ActivationBannerWithSubscriptionMessage = ({ subscriptionInfos }) => {
  const subscriptionMessage = subscriptionInfos?.subscriptionMessage || defaultSubscriptionMessage

  const { popOverIcon, userMessage } = subscriptionMessage
  const subscriptionIcon = matchSubscriptionMessageIconToSvg(popOverIcon)
  const isMailAppAvailable = useIsMailAppAvailable()
  const links = getCallToActionLinkForSubscriptionMessage(subscriptionMessage, isMailAppAvailable)

  return (
    <Banner
      Icon={subscriptionIcon}
      label={userMessage}
      testID="activation-banner-with-subscription-message"
      links={links}
    />
  )
}
