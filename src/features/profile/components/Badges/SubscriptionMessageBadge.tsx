import React from 'react'
import styled from 'styled-components/native'

import { SubscriptionMessage } from 'api/gen'
import { Subtitle } from 'features/profile/atoms/Subtitle'
import { ProfileBadge } from 'features/profile/components/Badges/ProfileBadge'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers/formatDates'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { Spacer } from 'ui/theme'

type SubscriptionMessageBadgeProps = {
  subscriptionMessage?: SubscriptionMessage | null
}

const formatDateToLastUpdatedAtMessage = (lastUpdatedDate: string | undefined) => {
  if (!lastUpdatedDate) return
  const day = formatToSlashedFrenchDate(new Date(lastUpdatedDate).toISOString())
  const hour = formatToHour(new Date(lastUpdatedDate))
  return `${day} à ${hour}`
}

export function SubscriptionMessageBadge(props: SubscriptionMessageBadgeProps) {
  return (
    <React.Fragment>
      {!!props.subscriptionMessage?.updatedAt && (
        <React.Fragment>
          <Subtitle
            startSubtitle="Dossier mis à jour le&nbsp;:"
            boldEndSubtitle={formatDateToLastUpdatedAtMessage(props.subscriptionMessage?.updatedAt)}
          />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      )}
      <ProfileBadge
        popOverIcon={
          matchSubscriptionMessageIconToSvg(props.subscriptionMessage?.popOverIcon, true) || Clock
        }
        callToActionIcon={matchSubscriptionMessageIconToSvg(
          props.subscriptionMessage?.callToAction?.callToActionIcon
        )}
        callToActionMessage={props.subscriptionMessage?.callToAction?.callToActionTitle}
        callToActionLink={props.subscriptionMessage?.callToAction?.callToActionLink}
        message={
          props.subscriptionMessage?.userMessage ||
          'Ton dossier est déposé. Nous avons bien reçu ton dossier et sommes en train de l’analyser\u00a0!'
        }
        testID="subscription-message-badge"
      />
    </React.Fragment>
  )
}

const Clock = styled(BicolorClock).attrs(({ theme }) => ({
  color: theme.colors.black,
  color2: theme.colors.black,
}))``
