import { t } from '@lingui/macro'

import { WithdrawalTypeEnum } from 'api/gen'
import { formatSecondsToString } from 'features/bookings/helpers'

export const getStartMessage = (withdrawalType: WithdrawalTypeEnum): string | null => {
  switch (withdrawalType) {
    case WithdrawalTypeEnum.on_site:
      return t`Présente le code ci-dessus sur place` + ' '
    case WithdrawalTypeEnum.by_email:
      return t`Tu vas recevoir ton billet par e-mail` + ' '
    case WithdrawalTypeEnum.no_ticket:
      return null
  }
}

export const getDelayMessage = (withdrawalDelay: number): string | null => {
  if (withdrawalDelay > 0) return `${formatSecondsToString(withdrawalDelay)} `
  return null
}
