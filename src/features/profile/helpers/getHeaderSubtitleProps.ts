import { EligibilityType } from 'api/gen'
import { formatToSlashedFrenchDate, setDateOneDayEarlier } from 'libs/dates'

export const getHeaderSubtitleProps = ({
  isCreditEmpty,
  isDepositExpired,
  depositExpirationDate,
  eligibility,
}: {
  isCreditEmpty: boolean
  isDepositExpired: boolean
  depositExpirationDate?: string
  eligibility?: EligibilityType | null
}) => {
  const displayedExpirationDate = depositExpirationDate
    ? formatToSlashedFrenchDate(setDateOneDayEarlier(depositExpirationDate))
    : ''

  if (isDepositExpired)
    return { startSubtitle: 'Ton crédit a expiré le', boldEndSubtitle: displayedExpirationDate }

  const isUserFreeStatus = eligibility === EligibilityType.free
  const creditEmptySubtitle = isUserFreeStatus ? '' : 'Tu as dépensé tout ton crédit'
  if (isCreditEmpty) return { startSubtitle: creditEmptySubtitle }

  return {
    startSubtitle: 'Profite de ton crédit jusqu’au',
    boldEndSubtitle: displayedExpirationDate,
  }
}
