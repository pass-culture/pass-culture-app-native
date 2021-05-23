import { t } from '@lingui/macro'
import React from 'react'

import { useDepositAmount } from 'features/auth/api'
import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { Clock } from 'ui/svg/icons/Clock'

export function YoungerBadge() {
  const depositAmount = useDepositAmount()
  const deposit = depositAmount.replace(' ', '')

  return (
    <ProfileBadge
      icon={Clock}
      message={t({
        id: 'patience enfin',
        values: { deposit },
        message:
          'Patience ! L’année de tes 18 ans, tu bénéficieras de {deposit} offerts à dépenser sur l’application.',
      })}
    />
  )
}
