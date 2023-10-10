import { differenceInDays } from 'date-fns'

import { plural } from 'libs/plural'

export const getCreditExpirationText = (
  depositExpirationDate: Date,
  baseDate: Date = new Date()
): string | undefined => {
  const daysLeft = differenceInDays(depositExpirationDate, baseDate)

  if (daysLeft > 7 || daysLeft < 0) return

  if (daysLeft === 0)
    return 'Ton crédit sera remis à 0 aujourd’hui. Profite de ton crédit restant\u00a0!'

  return `Ton crédit sera remis à 0 dans ${daysLeft} ${plural(daysLeft, {
    singular: 'jour',
    plural: 'jours',
  })}. Profite de ton crédit restant\u00a0!`
}
