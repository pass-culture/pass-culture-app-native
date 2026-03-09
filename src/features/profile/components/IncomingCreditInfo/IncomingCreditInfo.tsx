import React from 'react'

import { HighlightedBody } from 'features/profile/components/HighlightedBody/HighlightedBody'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { getAge } from 'shared/user/getAge'
import { Typo } from 'ui/theme'

type Props = {
  birthDate: UserProfileResponseWithoutSurvey['birthDate'] | null
  seventeenYearsOldDeposit: string
  eighteenYearsOldDeposit: string
}

export const IncomingCreditInfo = ({
  birthDate,
  seventeenYearsOldDeposit,
  eighteenYearsOldDeposit,
}: Props) => {
  const age = getAge(birthDate)

  if (!age) return null

  const sixteenYearsOldIncomingDeposit = {
    label: 'À venir pour tes 17 ans\u00a0: ',
    highlightedLabel: `+ ${seventeenYearsOldDeposit}`,
  }

  const seventeenYearsOldIncomingDeposit = {
    label: 'À venir pour tes 18 ans\u00a0: ',
    highlightedLabel: `+ ${eighteenYearsOldDeposit}`,
  }

  const incomingCreditLabelsMap: Record<number, { label: string; highlightedLabel: string }> = {
    15: sixteenYearsOldIncomingDeposit,
    16: sixteenYearsOldIncomingDeposit,
    17: seventeenYearsOldIncomingDeposit,
  }

  const creditInfo = incomingCreditLabelsMap[age]

  if (!creditInfo) return null

  return (
    <Typo.Body>
      {creditInfo.label}
      <HighlightedBody>{creditInfo.highlightedLabel}</HighlightedBody>
    </Typo.Body>
  )
}
