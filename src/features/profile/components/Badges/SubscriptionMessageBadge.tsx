import React from 'react'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { SubscriptionMessage } from 'api/gen'
import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { formatDateToLastUpdatedAtMessage } from 'features/profile/helpers/formatDateToLastUpdatedAtMessage'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/helpers/matchSubscriptionMessageIconToSvg'
import { shouldOpenInbox as checkShouldOpenInbox } from 'features/profile/helpers/shouldOpenInbox'
import { RemoteActivationBanner } from 'features/remoteBanners/banners/RemoteActivationBanner'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Clock } from 'ui/svg/icons/Clock'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

const getCallToActionLink = (
  subscriptionMessage: SubscriptionMessage,
  isMailAppAvailable: boolean
) => {
  const { callToActionTitle, callToActionLink, callToActionIcon } =
    subscriptionMessage.callToAction ?? {}

  if (!callToActionTitle || !callToActionLink) return []

  const shouldOpenInbox = checkShouldOpenInbox(callToActionLink)

  if (isMailAppAvailable && shouldOpenInbox) {
    return [
      {
        icon: matchSubscriptionMessageIconToSvg(callToActionIcon, EmailFilled),
        wording: callToActionTitle,
        onPress: openInbox,
      },
    ]
  }

  return [
    {
      icon: matchSubscriptionMessageIconToSvg(callToActionIcon, ExternalSiteFilled),
      wording: callToActionTitle,
      externalNav: { url: callToActionLink },
    },
  ]
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
  const isMailAppAvailable = useIsMailAppAvailable()
  const { callToAction, popOverIcon, userMessage, updatedAt } = subscriptionMessage

  const icon = callToAction?.callToActionIcon
    ? Clock
    : matchSubscriptionMessageIconToSvg(popOverIcon)

  const links = getCallToActionLink(subscriptionMessage, isMailAppAvailable)

  return (
    <Container>
      {updatedAt ? (
        <SubtitleContainer>
          <Subtitle
            startSubtitle="Dossier mis à jour le&nbsp;:"
            boldEndSubtitle={formatDateToLastUpdatedAtMessage(updatedAt)}
          />
        </SubtitleContainer>
      ) : null}
      {disableActivation ? (
        <RemoteActivationBannerContainer>
          <RemoteActivationBanner
            from="profile"
            remoteActivationBannerOptions={remoteActivationBannerOptions}
          />
        </RemoteActivationBannerContainer>
      ) : null}
      <Banner Icon={icon} label={userMessage} testID="subscription-message-badge" links={links} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))

const SubtitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const RemoteActivationBannerContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.xl,
}))
