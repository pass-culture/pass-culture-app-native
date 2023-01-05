import React from 'react'
import { openInbox } from 'react-native-email-link'

import { SubscriptionMessage } from 'api/gen'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/helpers/matchSubscriptionMessageIconToSvg'
import { shouldOpenInbox as checkShouldOpenInbox } from 'features/profile/helpers/shouldOpenInbox'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers/formatDates'
import { Banner } from 'ui/components/Banner'
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

const formatDateToLastUpdatedAtMessage = (lastUpdatedDate: string | undefined) => {
  if (!lastUpdatedDate) return
  const day = formatToSlashedFrenchDate(new Date(lastUpdatedDate).toISOString())
  const hour = formatToHour(new Date(lastUpdatedDate))
  return `${day} à ${hour}`
}

const CallToAction = ({ subscriptionMessage }: Props) => {
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
        <ExternalTouchableLink
          as={ButtonQuaternarySecondary}
          externalNav={{ url: callToActionLink }}
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

  const message =
    userMessage ??
    'Ton dossier est déposé. Nous avons bien reçu ton dossier et sommes en train de l’analyser\u00a0!'

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
        message={message}
        withLightColorMessage={!!callToAction?.callToActionTitle}
        testID="subscription-message-badge">
        <CallToAction subscriptionMessage={subscriptionMessage} />
      </Banner>
    </React.Fragment>
  )
}
