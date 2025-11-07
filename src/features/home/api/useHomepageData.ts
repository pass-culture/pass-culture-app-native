import { UserOnboardingRole } from 'features/onboarding/enums'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'

enum HomepageType {
  GENERAL = 'general',
  BENEFICIARY = 'beneficiary',
  FREE_BENEFICIARY = 'free_beneficiary',
  WITHOUT_BOOKING = 'without_booking',
}

const getHomepageType = (
  isLoggedIn: boolean,
  isFreeBeneficiary: boolean,
  isBeneficiary: boolean,
  hasBookings: boolean,
  onboardingRole: UserOnboardingRole
): HomepageType => {
  if (!isLoggedIn) {
    if (onboardingRole === UserOnboardingRole.EIGHTEEN) {
      return HomepageType.BENEFICIARY
    }
    if (onboardingRole === UserOnboardingRole.UNDERAGE) {
      return HomepageType.FREE_BENEFICIARY
    }
    return HomepageType.GENERAL
  }

  if (isFreeBeneficiary) return HomepageType.FREE_BENEFICIARY
  if (isBeneficiary) return hasBookings ? HomepageType.BENEFICIARY : HomepageType.WITHOUT_BOOKING

  return HomepageType.GENERAL
}

export const getHomepagId = (
  isLoggedIn: boolean,
  isFreeBeneficiary: boolean,
  isBeneficiary: boolean,
  hasBookings: boolean,
  onboardingRole: UserOnboardingRole,
  remoteConfig: CustomRemoteConfig
): string => {
  const homepageType = getHomepageType(
    isLoggedIn,
    isFreeBeneficiary,
    isBeneficiary,
    hasBookings,
    onboardingRole
  )
  switch (homepageType) {
    case HomepageType.BENEFICIARY:
      return remoteConfig.homeEntryIdBeneficiary
    case HomepageType.FREE_BENEFICIARY:
      return remoteConfig.homeEntryIdFreeBeneficiary
    case HomepageType.GENERAL:
      return remoteConfig.homeEntryIdGeneral
    case HomepageType.WITHOUT_BOOKING:
      return remoteConfig.homeEntryIdWithoutBooking
  }
}
