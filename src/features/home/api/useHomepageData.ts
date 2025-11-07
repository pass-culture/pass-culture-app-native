import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFetchHomepageByIdQuery } from 'features/home/queries/useGetHomepageListQuery'
import { Homepage } from 'features/home/types'
import { UserOnboardingRole } from 'features/onboarding/enums'
import { useUserRoleFromOnboarding } from 'features/onboarding/helpers/useUserRoleFromOnboarding'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { isUserFreeBeneficiary } from 'features/profile/helpers/isUserFreeBeneficiary'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { useUserHasBookingsQuery } from 'queries/bookings'

enum HomepageType {
  GENERAL = 'general',
  BENEFICIARY = 'beneficiary',
  FREE_BENEFICIARY = 'free_beneficiary',
  WITHOUT_BOOKING = 'without_booking',
}

type HomeCriterias = {
  isLoggedIn: boolean
  isFreeBeneficiary: boolean
  isBeneficiary: boolean
  hasBookings: boolean
  onboardingRole: UserOnboardingRole
}

const getHomepageType = ({
  isLoggedIn,
  isFreeBeneficiary,
  isBeneficiary,
  hasBookings,
  onboardingRole,
}: HomeCriterias): HomepageType => {
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

export const getHomepageId = (
  { isLoggedIn, isFreeBeneficiary, isBeneficiary, hasBookings, onboardingRole }: HomeCriterias,
  remoteConfig: CustomRemoteConfig
): string => {
  const homepageType = getHomepageType({
    isLoggedIn,
    isFreeBeneficiary,
    isBeneficiary,
    hasBookings,
    onboardingRole,
  })
  console.log('getHomepagId args: ', {
    isLoggedIn,
    isFreeBeneficiary,
    isBeneficiary,
    hasBookings,
    onboardingRole,
  })
  let homeId = remoteConfig.homeEntryIdGeneral
  switch (homepageType) {
    case HomepageType.BENEFICIARY:
      homeId = remoteConfig.homeEntryIdBeneficiary
      break
    case HomepageType.FREE_BENEFICIARY:
      homeId = remoteConfig.homeEntryIdFreeBeneficiary
      break
    case HomepageType.GENERAL:
      homeId = remoteConfig.homeEntryIdGeneral
      break
    case HomepageType.WITHOUT_BOOKING:
      homeId = remoteConfig.homeEntryIdWithoutBooking
      break
  }
  console.log('Home to show: ', { homepageType, homeId })
  return homeId
}

export const useHomepageData = (): Homepage | undefined => {
  const { isLoggedIn, user } = useAuthContext()
  const userHasBookings = useUserHasBookingsQuery()
  const onboardingRole = useUserRoleFromOnboarding()
  const { data: remoteConfig } = useRemoteConfigQuery()
  const homepageId = getHomepageId(
    {
      isLoggedIn: isLoggedIn && !!user,
      isFreeBeneficiary: isUserFreeBeneficiary(user),
      isBeneficiary: isUserBeneficiary(user),
      hasBookings: userHasBookings,
      onboardingRole,
    },
    remoteConfig
  )
  const { data } = useFetchHomepageByIdQuery(homepageId)
  return data
}
