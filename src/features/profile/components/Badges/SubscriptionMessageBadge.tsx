import React from 'react'
import { Platform } from 'react-native'
import { openInbox } from 'react-native-email-link'

import { SubscriptionMessage } from 'api/gen'
import { useIsMailAppAvailableIOS } from 'features/auth/helpers/useIsMailAppAvailableIOS'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { formatDateToLastUpdatedAtMessage } from 'features/profile/helpers/formatDateToLastUpdatedAtMessage'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/helpers/matchSubscriptionMessageIconToSvg'
import { shouldOpenInbox as checkShouldOpenInbox } from 'features/profile/helpers/shouldOpenInbox'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Clock } from 'ui/svg/icons/BicolorClock'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer } from 'ui/theme'

type Props = {
  subscriptionMessage: SubscriptionMessage
}
const CallToAction = ({ subscriptionMessage }: Props) => {
  const isMailAppAvailable = useIsMailAppAvailableIOS()
  const { callToActionTitle, callToActionLink, callToActionIcon } =
    subscriptionMessage.callToAction ?? {}

  if (!callToActionTitle || !callToActionLink) return null

  const shouldOpenInbox = !!callToActionLink && checkShouldOpenInbox(callToActionLink)

  const sharedButtonProps = {
    wording: callToActionTitle,
    numberOfLines: 2,
    justifyContent: 'flex-start' as BaseButtonProps['justifyContent'],
    inline: true as BaseButtonProps['inline'],
  }

  const shouldDisplayOpenInboxButton = () => {
    return Platform.OS === 'ios' ? isMailAppAvailable : true
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      {shouldDisplayOpenInboxButton() && shouldOpenInbox ? (
        <ButtonQuaternarySecondary
          onPress={openInbox}
          icon={matchSubscriptionMessageIconToSvg(callToActionIcon, EmailFilled)}
          {...sharedButtonProps}
        />
      ) : (
        <ExternalTouchableLink
          as={ButtonQuaternarySecondary}
          externalNav={{ url: callToActionLink }}
          openInNewWindow={false}
          icon={ExternalSiteFilled}
          {...sharedButtonProps}
        />
      )}
    </React.Fragment>
  )
}

export const SubscriptionMessageBadge = ({ subscriptionMessage }: Props) => {
  const { callToAction, popOverIcon, userMessage, updatedAt } = subscriptionMessage

  const icon = !callToAction?.callToActionIcon
    ? matchSubscriptionMessageIconToSvg(popOverIcon)
    : Clock

  return (
    <React.Fragment>
      {!!updatedAt && (
        <React.Fragment>
          <Subtitle
            startSubtitle="Dossier mis à jour le&nbsp;:"
            boldEndSubtitle={formatDateToLastUpdatedAtMessage(updatedAt)}
          />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={2} />
      <InfoBanner
        icon={icon}
        message={userMessage}
        withLightColorMessage={!!callToAction?.callToActionTitle}
        testID="subscription-message-badge">
        <CallToAction subscriptionMessage={subscriptionMessage} />
      </InfoBanner>
    </React.Fragment>
  )
}
