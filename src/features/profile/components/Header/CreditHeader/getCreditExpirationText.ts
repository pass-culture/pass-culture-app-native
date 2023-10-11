import { differenceInDays } from 'date-fns'

import { plural } from 'libs/plural'

type UserStatus = 'beneficiary' | 'underageBeneficiary'
type Args = {
  depositExpirationDate: Date
  baseDate?: Date
  userStatus?: UserStatus
}

export const getCreditExpirationText = ({
  depositExpirationDate,
  baseDate = new Date(),
  userStatus,
}: Args): string | undefined => {
  const daysLeft = differenceInDays(depositExpirationDate, baseDate)
  const expirationActionText = userStatus === 'beneficiary' ? 'expire' : 'sera remis à 0'

  if (daysLeft > 7 || daysLeft < 0) return

  if (daysLeft === 0)
    return `Ton crédit ${expirationActionText} aujourd’hui. Profite rapidement de ton crédit restant\u00a0!`

  return `Ton crédit ${expirationActionText} dans ${daysLeft} ${plural(daysLeft, {
    singular: 'jour',
    plural: 'jours',
  })}. Profite rapidement de ton crédit restant\u00a0!`
}
