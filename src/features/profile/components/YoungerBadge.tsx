import { t } from '@lingui/macro'
import React from 'react'

import { useDepositAmount } from 'features/auth/api'
import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { Clock } from 'ui/svg/icons/Clock'

export function YoungerBadge() {
  const depositAmount = useDepositAmount()
  const deposit = depositAmount.replace(' ', '')

  const information =
    t`Patience ! À tes 18 ans, tu bénéficieras de` +
    '\u00a0' +
    deposit +
    '\u00a0' +
    t`offerts à dépenser sur l’application.`

  return <ProfileBadge icon={Clock} message={information} />
}
