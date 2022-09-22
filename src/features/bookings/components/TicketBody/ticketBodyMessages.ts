import { isSameDay } from 'date-fns'

import { WithdrawalTypeEnum } from 'api/gen'
import { formatSecondsToString } from 'features/bookings/helpers'
import { LINE_BREAK } from 'ui/theme/constants'

export const getStartMessage = (withdrawalType: WithdrawalTypeEnum): string | null => {
  switch (withdrawalType) {
    case WithdrawalTypeEnum.on_site:
      return 'Présente le code ci-dessus sur place '
    case WithdrawalTypeEnum.by_email:
      return 'Tu vas recevoir ton billet par e-mail '
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
    ? 'C’est aujourd’hui\u00a0!' +
      LINE_BREAK +
      'Tu as dû recevoir ton billet par e-mail. Pense à vérifier tes spams.'
    : 'Ton billet t’a été envoyé par e-mail. Pense à vérifier tes spams.'
