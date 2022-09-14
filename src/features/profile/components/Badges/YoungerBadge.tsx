import { t } from '@lingui/macro'
import React from 'react'

import { ProfileBadge } from 'features/profile/components/Badges/ProfileBadge'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

export function YoungerBadge(props: { eligibilityStartDatetime: Date }) {
  const information = t({
    id: "date d'éligibilité",
    values: { date: formatToSlashedFrenchDate(props.eligibilityStartDatetime.toISOString()) },
    message:
      'Patience\u00a0! Reviens à partir du {date} pour continuer ton inscription et bénéficier du crédit pass Culture.',
  })

  return <ProfileBadge popOverIcon={BicolorClock} message={information} testID={'younger-badge'} />
}
