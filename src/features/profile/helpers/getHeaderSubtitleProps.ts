import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { formatToSlashedFrenchDate, setDateOneDayEarlier } from 'libs/dates'

type Props = {
  isCreditEmpty: boolean
  isDepositExpired: boolean
  depositExpirationDate?: string | null
  statusType?: UserStatusType | null
  eligibilityType?: UserEligibilityType | null
}

type Output = {
  startSubtitle?: string
  boldEndSubtitle?: string
}

export const getHeaderSubtitleProps = ({
  isCreditEmpty,
  isDepositExpired,
  depositExpirationDate,
  eligibilityType,
  statusType,
}: Props): Output => {
  const isUserFreeStatus =
    eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V3_16 ||
    eligibilityType === UserEligibilityType.ELIGIBLE_CREDIT_V3_15
  const getCreditEmptySubtitle = () => {
    if (isUserFreeStatus) return undefined
    return statusType === UserStatusType.EX_BENEFICIARY
      ? 'Ton crédit est expiré'
      : 'Tu as dépensé tout ton crédit'
  }
  if (isCreditEmpty) return { startSubtitle: getCreditEmptySubtitle() }

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
