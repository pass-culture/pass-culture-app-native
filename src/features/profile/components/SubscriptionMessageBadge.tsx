import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { SubscriptionMessage } from 'api/gen'
import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers/formatDates'
import { Clock } from 'ui/svg/icons/Clock'
import { Spacer, Typo } from 'ui/theme'

type SubscriptionMessageBadgeProps = {
  subscriptionMessage?: SubscriptionMessage | null
}

const formatDateToLastUpdatedAtMessage = (lastUpdatedDate: string | undefined) =>
  lastUpdatedDate
    ? t({
        id: 'last update',
        values: {
          day: formatToSlashedFrenchDate(new Date(lastUpdatedDate).toISOString()),
          hour: formatToHour(new Date(lastUpdatedDate)),
        },
        message: 'Dossier mis à jour le\u00a0: {day} à {hour}',
      })
    : undefined

export function SubscriptionMessageBadge(props: SubscriptionMessageBadgeProps) {
  return (
    <React.Fragment>
      {!!props.subscriptionMessage?.updatedAt && (
        <React.Fragment>
          <Caption>
            {formatDateToLastUpdatedAtMessage(props.subscriptionMessage?.updatedAt)}
          </Caption>
          <Spacer.Column numberOfSpaces={2} />
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
          t`Dossier déposé, nous avons bien reçu ton dossier et sommes en train de l’analyser\u00a0!`
        }
        testID="subscription-message-badge"
      />
    </React.Fragment>
  )
}

const Caption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
