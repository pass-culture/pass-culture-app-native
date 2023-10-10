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
  const displayedExpirationDate = depositExpirationDate
    ? formatToSlashedFrenchDate(setDateOneDayEarlier(depositExpirationDate))
    : ''

  if (isDepositExpired)
    return { startSubtitle: 'Ton crédit a expiré le', boldEndSubtitle: displayedExpirationDate }

  if (isCreditEmpty) return { startSubtitle: 'Tu as dépensé tout ton crédit' }

  return {
    startSubtitle: 'Profite de ton crédit jusqu’au',
    boldEndSubtitle: displayedExpirationDate,
  }
}
