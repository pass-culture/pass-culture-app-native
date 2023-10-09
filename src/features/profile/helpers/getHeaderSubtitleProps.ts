import { formatToSlashedFrenchDate, setDateOneDayEarlier } from 'libs/dates'

export const getHeaderSubtitleProps = ({
  isCreditEmpty,
  isDepositExpired,
  depositExpirationDate,
}: {
  isCreditEmpty: boolean
  isDepositExpired: boolean
  depositExpirationDate?: string
}) => {
  if (isCreditEmpty) return { startSubtitle: 'Tu as dépensé tout ton crédit' }

  const displayedExpirationDate = depositExpirationDate
    ? formatToSlashedFrenchDate(setDateOneDayEarlier(depositExpirationDate))
    : ''

  if (isDepositExpired)
    return { startSubtitle: 'Ton crédit a expiré le', boldEndSubtitle: displayedExpirationDate }

  return {
    startSubtitle: 'Profite de ton crédit jusqu’au',
    boldEndSubtitle: displayedExpirationDate,
  }
}
