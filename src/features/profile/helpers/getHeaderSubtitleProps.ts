import { EligibilityType } from 'api/gen'
import { formatToSlashedFrenchDate, setDateOneDayEarlier } from 'libs/dates'

type Props = {
  isCreditEmpty: boolean
  isDepositExpired: boolean
  depositExpirationDate?: string | null
  eligibility?: EligibilityType | null
}

type Output = {
  startSubtitle?: string
  boldEndSubtitle?: string
}

export const getHeaderSubtitleProps = ({
  isCreditEmpty,
  isDepositExpired,
  depositExpirationDate,
  eligibility,
}: Props): Output => {
  const isUserFreeStatus = eligibility === EligibilityType.free
  const creditEmptySubtitle = isUserFreeStatus ? undefined : 'Tu as dépensé tout ton crédit'
  if (isCreditEmpty) return { startSubtitle: creditEmptySubtitle }

  const displayedExpirationDate = depositExpirationDate
    ? formatToSlashedFrenchDate(setDateOneDayEarlier(depositExpirationDate))
    : undefined

  if (displayedExpirationDate) {
    if (isDepositExpired) {
      return {
        startSubtitle: 'Ton crédit a expiré le',
        boldEndSubtitle: displayedExpirationDate,
      }
    }

    return {
      startSubtitle: 'Profite de ton crédit jusqu’au',
      boldEndSubtitle: displayedExpirationDate,
    }
  }

  return {
    startSubtitle: undefined,
    boldEndSubtitle: undefined,
  }
}
