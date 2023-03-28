import React from 'react'
import { openInbox } from 'react-native-email-link'

import { SubscriptionMessage } from 'api/gen'
import { isAppUrl } from 'features/navigation/helpers'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { formatDateToLastUpdatedAtMessage } from 'features/profile/helpers/formatDateToLastUpdatedAtMessage'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/helpers/matchSubscriptionMessageIconToSvg'
import { shouldOpenInbox as checkShouldOpenInbox } from 'features/profile/helpers/shouldOpenInbox'
import { Banner } from 'ui/components/Banner'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Clock } from 'ui/svg/icons/BicolorClock'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer } from 'ui/theme'

type Props = {
  subscriptionMessage: SubscriptionMessage
}

export const CallToAction = ({ subscriptionMessage }: Props) => {
  const { callToActionTitle, callToActionLink, callToActionIcon } =
    subscriptionMessage.callToAction || {}

  if (!callToActionTitle || !callToActionLink) return null

  const shouldOpenInbox = !!callToActionLink && checkShouldOpenInbox(callToActionLink)

  const sharedButtonProps = {
    wording: callToActionTitle,
    numberOfLines: 2,
    justifyContent: 'flex-start' as BaseButtonProps['justifyContent'],
    inline: true as BaseButtonProps['inline'],
  }

  const isCallToActionAnAppUrl = isAppUrl(callToActionLink)
  const TouchableLink = isCallToActionAnAppUrl ? (
    <InternalTouchableLink
      as={ButtonQuaternarySecondary}
      navigateTo={{ internalUrl: callToActionLink }}
      icon={ExternalSiteFilled}
      {...sharedButtonProps}
    />
  ) : (
    <ExternalTouchableLink
      as={ButtonQuaternarySecondary}
      externalNav={{ url: callToActionLink }}
      icon={ExternalSiteFilled}
      {...sharedButtonProps}
    />
  )

  //TODO(EveJulliard) A CHANGER le openInNewWindow={false}
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      {shouldOpenInbox ? (
        <ButtonQuaternarySecondary
          onPress={openInbox}
          icon={matchSubscriptionMessageIconToSvg(callToActionIcon, EmailFilled)}
          {...sharedButtonProps}
        />
      ) : (
        TouchableLink
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
      <Banner
        icon={icon}
        message={userMessage}
        withLightColorMessage={!!callToAction?.callToActionTitle}
        testID="subscription-message-badge">
        <CallToAction subscriptionMessage={subscriptionMessage} />
      </Banner>
    </React.Fragment>
  )
}
