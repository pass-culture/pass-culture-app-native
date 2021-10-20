import { openInbox } from 'react-native-email-link'

import { UserProfileResponse, DomainsCredit, UserRole } from 'api/gen/api'
import { useUserProfileInfo } from 'features/home/api'
import { Credit } from 'features/home/services/useAvailableCredit'
import { isAppUrl, openUrl } from 'features/navigation/helpers'
import { Clock } from 'ui/svg/icons/Clock'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { InfoDeprecated } from 'ui/svg/icons/Info_deprecated'

export function isUserBeneficiary(user: UserProfileResponse): boolean {
  return user.isBeneficiary
}

export function isUserExBeneficiary(user: UserProfileResponse, credit: Credit): boolean {
  const isExBeneficiary = user.isBeneficiary && credit.isExpired
  const isExUnderageBeneficiary = isUserUnderageBeneficiary(user) && credit.isExpired
  return isExBeneficiary || isExUnderageBeneficiary
}

export const computeCredit = (domainsCredit?: DomainsCredit | null) => {
  return domainsCredit ? domainsCredit.all.remaining : 0
}

export function isUserUnderageBeneficiary(user: UserProfileResponse | undefined): boolean {
  if (!user) return false
  const hasUserUnderageRole = user.roles?.find((role) => role === UserRole.UNDERAGEBENEFICIARY)
  return !!hasUserUnderageRole
}

export const useIsUserUnderageBeneficiary = () => {
  const { data: user } = useUserProfileInfo()
  return isUserUnderageBeneficiary(user)
}

export const matchSubscriptionMessageIconToSvg = (
  iconName: string | undefined,
  useFallbackIcon?: boolean | undefined
) => {
  switch (iconName) {
    case undefined:
      return undefined
    case 'CLOCK':
      return Clock
    case 'EMAIL':
      return EmailFilled
    default:
      return useFallbackIcon ? InfoDeprecated : undefined
  }
}

const OPEN_INBOX_URL_PART = 'openInbox'

export const handleCallToActionLink = (url: string) => {
  isAppUrl(url) && url.match(OPEN_INBOX_URL_PART) ? openInbox() : openUrl(url)
}
