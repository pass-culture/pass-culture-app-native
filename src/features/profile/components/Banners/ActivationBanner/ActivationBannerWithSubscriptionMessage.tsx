import React from 'react'

import { PopOverIcon, SubscriptionMessage, SubscriptionStepperResponseV2 } from 'api/gen'
import { getCallToActionLinkForSubscriptionMessage } from 'features/profile/helpers/getCallToActionLinkForSubscriptionMessage'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/helpers/matchSubscriptionMessageIconToSvg'
import { Banner } from 'ui/designSystem/Banner/Banner'

const defaultSubscriptionMessage: SubscriptionMessage = {
  userMessage: 'Une demande est en cours de traitement',
  popOverIcon: PopOverIcon.INFO,
  callToAction: undefined,
}

type Props = {
  subscriptionInfos?: SubscriptionStepperResponseV2
  isMailAppAvailable: boolean
}

export const ActivationBannerWithSubscriptionMessage = ({
  subscriptionInfos,
  isMailAppAvailable,
}: Props) => {
  const subscriptionMessage = subscriptionInfos?.subscriptionMessage || defaultSubscriptionMessage
  const { popOverIcon, userMessage } = subscriptionMessage
  const subscriptionIcon = matchSubscriptionMessageIconToSvg(popOverIcon)
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
