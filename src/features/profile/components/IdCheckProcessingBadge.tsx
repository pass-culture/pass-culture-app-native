import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'

import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers/formatDates'
import { Clock } from 'ui/svg/icons/Clock'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

type IdCheckProcessingBadgeProps = {
  icon?: FunctionComponent<IconInterface>
  message?: string
  lastUpdated?: string
  callToActionIcon?: FunctionComponent<IconInterface>
  callToActionMessage?: string
  callToActionLink?: string
}

const formatStringToLastUpdatedAtMessage = (lastUpdatedDate: string | undefined) =>
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
      {!!props.lastUpdated && (
        <React.Fragment>
          <Typo.Caption color={ColorsEnum.GREY_DARK}>
            {formatStringToLastUpdatedAtMessage(props.lastUpdated)}
          </Typo.Caption>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      <ProfileBadge
        icon={props.icon || Clock}
        callToActionIcon={props.callToActionIcon}
        callToActionMessage={props.callToActionMessage}
        callToActionLink={props.callToActionLink}
        message={
          props.message ||
          t`Dossier déposé, nous avons bien reçu ton dossier et sommes en train de l’analyser !`
        }
      />
    </React.Fragment>
  )
}
