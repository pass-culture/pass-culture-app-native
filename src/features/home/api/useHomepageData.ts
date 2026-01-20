import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFetchHomepageByIdQuery } from 'features/home/queries/useGetHomepageQuery'
import { Homepage } from 'features/home/types'
import { UserOnboardingRole } from 'features/onboarding/enums'
import { useUserRoleFromOnboarding } from 'features/onboarding/helpers/useUserRoleFromOnboarding'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { isUserFreeBeneficiaryOrEligible } from 'features/profile/helpers/isUserFreeBeneficiaryOrEligible'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { useUserHasBookingsQuery } from 'queries/bookings'

enum HomepageType {
  GENERAL,
  BENEFICIARY,
  FREE_BENEFICIARY,
  WITHOUT_BOOKING,
}

type HomeCriterias = {
  isLoggedIn: boolean
  isFreeBeneficiaryOrEligible: boolean
  isBeneficiary: boolean
  hasBookings: boolean
  onboardingRole: UserOnboardingRole
}

export const EMPTY_HOMEPAGE: Homepage = {
  tags: [],
  id: '-1',
  modules: [],
  thematicHeader: undefined,
}

const getHomepageType = ({
  isLoggedIn,
  isFreeBeneficiaryOrEligible,
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

  if (isFreeBeneficiaryOrEligible) return HomepageType.FREE_BENEFICIARY
  if (isBeneficiary) return hasBookings ? HomepageType.BENEFICIARY : HomepageType.WITHOUT_BOOKING

  return HomepageType.GENERAL
}

export const getHomepageId = (
  {
    isLoggedIn,
    isFreeBeneficiaryOrEligible,
    isBeneficiary,
    hasBookings,
    onboardingRole,
  }: HomeCriterias,
  remoteConfig: CustomRemoteConfig
): string => {
  const homePageRemoteConfig: Record<HomepageType, string> = {
    [HomepageType.BENEFICIARY]: remoteConfig.homeEntryIdBeneficiary,
    [HomepageType.FREE_BENEFICIARY]: remoteConfig.homeEntryIdFreeBeneficiary,
    [HomepageType.GENERAL]: remoteConfig.homeEntryIdGeneral,
    [HomepageType.WITHOUT_BOOKING]: remoteConfig.homeEntryIdWithoutBooking,
  }
  const homepageType = getHomepageType({
    isLoggedIn,
    isFreeBeneficiaryOrEligible,
    isBeneficiary,
    hasBookings,
    onboardingRole,
  })
  return homePageRemoteConfig[homepageType]
}

export const useHomepageData = (): Homepage => {
  const { isLoggedIn, user } = useAuthContext()
  const userHasBookings = useUserHasBookingsQuery()
  const onboardingRole = useUserRoleFromOnboarding()
  const { data: remoteConfig } = useRemoteConfigQuery()
  const homepageId = getHomepageId(
    {
      isLoggedIn: isLoggedIn && !!user,
      isFreeBeneficiaryOrEligible: isUserFreeBeneficiaryOrEligible(user),
      isBeneficiary: isUserBeneficiary(user),
      hasBookings: userHasBookings,
      onboardingRole,
    },
    remoteConfig
  )
  return useGetHomepageById(homepageId)
}

export const useGetHomepageById = (homepageId: string): Homepage => {
  const { data } = useFetchHomepageByIdQuery(homepageId)
  return data ?? EMPTY_HOMEPAGE
}
