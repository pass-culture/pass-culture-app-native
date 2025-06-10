import React from 'react'
import { openInbox } from 'react-native-email-link'

import { SubscriptionMessage } from 'api/gen'
import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { formatDateToLastUpdatedAtMessage } from 'features/profile/helpers/formatDateToLastUpdatedAtMessage'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/helpers/matchSubscriptionMessageIconToSvg'
import { shouldOpenInbox as checkShouldOpenInbox } from 'features/profile/helpers/shouldOpenInbox'
import { RemoteActivationBanner } from 'features/remoteBanners/banners/RemoteActivationBanner'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { BaseButtonProps } from 'ui/components/buttons/AppButton/types'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Clock } from 'ui/svg/icons/Clock'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer } from 'ui/theme'

type CallToActionProps = {
  subscriptionMessage: SubscriptionMessage
}

const CallToAction = ({ subscriptionMessage }: CallToActionProps) => {
  const isMailAppAvailable = useIsMailAppAvailable()
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

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      {isMailAppAvailable && shouldOpenInbox ? (
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

type SubscriptionMessageBadgeProps = {
  disableActivation: boolean
  subscriptionMessage: SubscriptionMessage
  remoteActivationBannerOptions: Record<string, unknown>
}

export const SubscriptionMessageBadge = ({
  disableActivation,
  subscriptionMessage,
  remoteActivationBannerOptions,
}: SubscriptionMessageBadgeProps) => {
  const { callToAction, popOverIcon, userMessage, updatedAt } = subscriptionMessage

  const icon = callToAction?.callToActionIcon
    ? Clock
    : matchSubscriptionMessageIconToSvg(popOverIcon)

  return (
    <React.Fragment>
      {updatedAt ? (
        <React.Fragment>
          <Subtitle
            startSubtitle="Dossier mis à jour le&nbsp;:"
            boldEndSubtitle={formatDateToLastUpdatedAtMessage(updatedAt)}
          />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      ) : null}

      <Spacer.Column numberOfSpaces={2} />

      {disableActivation ? (
        <React.Fragment>
          <RemoteActivationBanner
            from="profile"
            remoteActivationBannerOptions={remoteActivationBannerOptions}
          />
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      ) : null}

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
