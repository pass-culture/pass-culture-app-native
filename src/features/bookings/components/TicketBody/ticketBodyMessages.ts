import { t } from '@lingui/macro'
import { isSameDay } from 'date-fns'

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

export const getEmailMessage = (offerDate: Date): string =>
  isSameDay(offerDate, new Date())
    ? t`C'est aujourd'hui\u00a0!` +
      '\n' +
      t`Tu as dû recevoir ton billet par e-mail. Pense à vérifier tes spams.`
    : t`Ton billet t'a été envoyé par e-mail. Pense à vérifier tes spams.`
