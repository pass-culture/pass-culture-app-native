import { t } from '@lingui/macro'
import React from 'react'

import { SubscriptionMessage } from 'api/gen'
import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/utils'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers/formatDates'
import { Clock } from 'ui/svg/icons/Clock'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

type IdCheckProcessingBadgeProps = {
  subscriptionMessage?: SubscriptionMessage | null
}

const formatDateToLastUpdatedAtMessage = (lastUpdatedDate: Date | undefined) =>
  lastUpdatedDate
    ? t({
        id: 'last update',
        values: {
          day: formatToSlashedFrenchDate(new Date(lastUpdatedDate).toISOString()),
          hour: formatToHour(new Date(lastUpdatedDate)),
        },
        message: 'Dossier mis à jour le : {day} à {hour}',
      })
    : undefined

export function IdCheckProcessingBadge(props: IdCheckProcessingBadgeProps) {
  return (
    <React.Fragment>
      {!!props.subscriptionMessage?.updatedAt && (
        <React.Fragment>
          <Typo.Caption color={ColorsEnum.GREY_DARK}>
            {formatDateToLastUpdatedAtMessage(props.subscriptionMessage?.updatedAt)}
          </Typo.Caption>
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
      />
    </React.Fragment>
  )
}
