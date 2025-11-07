import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFetchHomepageByIdQuery } from 'features/home/queries/useGetHomepageQuery'
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

export const EMPTY_HOMEPAGE: Homepage = {
  tags: [],
  id: '-1',
  modules: [],
  thematicHeader: undefined,
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

export const useHomepageData = (): Homepage => {
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
  return useGetHomepageById(homepageId)
}

export const useGetHomepageById = (homepageId: string): Homepage => {
  const { data } = useFetchHomepageByIdQuery(homepageId)
  return data ?? EMPTY_HOMEPAGE
}
