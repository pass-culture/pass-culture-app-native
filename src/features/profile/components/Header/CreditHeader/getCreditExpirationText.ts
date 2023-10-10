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

  if (daysLeft > 7 || daysLeft < 0) return

  if (daysLeft === 0)
    return 'Ton crédit sera remis à 0 aujourd’hui. Profite de ton crédit restant\u00a0!'

  return `Ton crédit sera remis à 0 dans ${daysLeft} ${plural(daysLeft, {
    singular: 'jour',
    plural: 'jours',
  })}. Profite de ton crédit restant\u00a0!`
}
