import { EligibilityType } from 'api/gen'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { formatToSlashedFrenchDate, setDateOneDayEarlier } from 'libs/dates'

type Props = {
  isCreditEmpty: boolean
  isDepositExpired: boolean
  depositExpirationDate?: string | null
  eligibility?: EligibilityType | null
  statusType?: UserStatusType | null
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
  statusType,
}: Props): Output => {
  const isUserFreeStatus = eligibility === EligibilityType.free
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
