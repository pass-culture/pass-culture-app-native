import { openInbox } from 'react-native-email-link'

import { UserProfileResponse, DomainsCredit, UserRole, EligibilityType } from 'api/gen/api'
import { useUserProfileInfo } from 'features/home/api'
import { getAvailableCredit } from 'features/home/services/useAvailableCredit'
import { isAppUrl, openUrl } from 'features/navigation/helpers'
import { Again } from 'ui/svg/icons/Again'
import { Clock } from 'ui/svg/icons/Clock'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Error } from 'ui/svg/icons/Error'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Info } from 'ui/svg/icons/Info'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { Warning } from 'ui/svg/icons/Warning'

export function isUserBeneficiary(user: UserProfileResponse): boolean {
  return user.isBeneficiary
}

export function isUserExBeneficiary(user: UserProfileResponse): boolean {
  const credit = getAvailableCredit(user)
  const isExBeneficiary = user.isBeneficiary && credit.isExpired
  const isExUnderageBeneficiary = isUserUnderageBeneficiary(user) && credit.isExpired
  return isExBeneficiary || isExUnderageBeneficiary
}

export const computeCredit = (domainsCredit?: DomainsCredit | null) => {
  return domainsCredit ? domainsCredit.all.remaining : 0
}

export function isUserUnderageBeneficiary(user: UserProfileResponse | undefined): boolean {
  if (!user) return false
  const hasUserUnderageRole = user.roles?.find((role) => role === UserRole.UNDERAGE_BENEFICIARY)
  return !!hasUserUnderageRole
}

const isUserUnderage = (user?: UserProfileResponse) =>
  user?.eligibility === EligibilityType.underage

export const useIsUserUnderage = () => {
  const { data: user } = useUserProfileInfo()
  return isUserUnderage(user)
}

export const useIsUserUnderageBeneficiary = () => {
  const { data: user } = useUserProfileInfo()
  return isUserUnderageBeneficiary(user)
}

export const matchSubscriptionMessageIconToSvg = (
  iconName: string | undefined | null,
  useFallbackIcon?: boolean | undefined
) => {
  switch (iconName) {
    case undefined:
    case null:
      return undefined
    case 'CLOCK':
      return Clock
    case 'EXTERNAL':
      return ExternalSiteFilled
    case 'MAGNIFYING_GLASS':
      return MagnifyingGlass
    case 'ERROR':
      return Error
    case 'WARNING':
      return Warning
    case 'EMAIL':
      return EmailFilled
    case 'FILE':
      return LegalNotices
    case 'RETRY':
      return Again
    default:
      return useFallbackIcon ? Info : undefined
  }
}

const OPEN_INBOX_URL_PART = 'openInbox'

export const handleCallToActionLink = (url: string) => {
  isAppUrl(url) && url.match(OPEN_INBOX_URL_PART) ? openInbox() : openUrl(url)
}
