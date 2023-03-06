import omit from 'lodash/omit'
import { useCallback } from 'react'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBookings } from 'features/bookings/api'
import { useUserHasBookings } from 'features/bookings/api/useUserHasBookings'
import { Homepage } from 'features/home/types'
import { useUserRoleFromOnboarding } from 'features/onboarding/helpers/useUserRoleFromOnboarding'
import { UserOnboardingRole } from 'features/onboarding/types'
import { isUserBeneficiary18 } from 'features/profile/helpers/isUserBeneficiary18'
import { isUserUnderage } from 'features/profile/helpers/isUserUnderage'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { getAvailableCredit } from 'shared/user/useAvailableCredit'

const scoreHomepageByTags = (
  homepage: Homepage,
  user?: UserProfileResponse
): Homepage & { score: number } => {
  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const tags = homepage.tags

  let score = 0
  if (tags.includes('master')) score += 5
  if (tags.includes('userunderage')) score += isUnderageBeneficiary ? 3 : -3
  if (tags.includes('usergrandpublic')) score += isUnderageBeneficiary ? -1 : 1
  return { ...homepage, score }
}

// this creates a selector to pick the adequate homepage to show
export const useSelectHomepageEntry = (
  homepageEntryId?: string
): ((homepageList: Homepage[]) => Homepage | undefined) => {
  const { isLoggedIn, user } = useAuthContext()
  const userHasBookings = useUserHasBookings()
  const { data: userBookings } = useBookings()
  const onboardingRole = useUserRoleFromOnboarding()
  const {
    homeEntryIdGeneral,
    homeEntryIdWithoutBooking_18,
    homeEntryIdWithoutBooking_15_17,
    homeEntryId_18,
    homeEntryId_15_17,
    ...onboardingHomeEntryIds
  } = useRemoteConfigContext()

  return useCallback(
    (homepageList: Homepage[]): Homepage | undefined => {
      if (homepageList.length === 0) return

      // If no homepage is tagged, we show the last published one
      const firstHomepageEntry = homepageList[0]

      // If we are coming from a deeplink or firebase remote config we suppose the homepageEntryId exists
      if (homepageEntryId)
        return homepageList.find(({ id }) => id === homepageEntryId) || firstHomepageEntry

      const scoredEntries = homepageList
        .map((homepageEntry) => scoreHomepageByTags(homepageEntry, user))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)

      const defaultHomepageEntry = scoredEntries.length
        ? omit(scoredEntries[0], 'score')
        : firstHomepageEntry

      if (!isLoggedIn || !user) {
        const onboardingHomeEntryId = getOnboardingHomepageEntryId(
          onboardingRole,
          onboardingHomeEntryIds
        )

        return homepageList.find(({ id }) => id === onboardingHomeEntryId) || defaultHomepageEntry
      }

      if (isUserUnderage(user)) {
        if (userHasBookings) {
          return homepageList.find(({ id }) => id === homeEntryId_15_17) || defaultHomepageEntry
        }
        return (
          homepageList.find(({ id }) => id === homeEntryIdWithoutBooking_15_17) ||
          defaultHomepageEntry
        )
      }

      const credit = getAvailableCredit(user)
      if (user?.eligibility === 'age-18' || (isUserBeneficiary18(user) && !credit.isExpired)) {
        if (userBookings?.hasBookingsAfter18) {
          return homepageList.find(({ id }) => id === homeEntryId_18) || defaultHomepageEntry
        }
        return (
          homepageList.find(({ id }) => id === homeEntryIdWithoutBooking_18) || defaultHomepageEntry
        )
      }

      return homepageList.find(({ id }) => id === homeEntryIdGeneral) || defaultHomepageEntry
    },
    [
      homepageEntryId,
      isLoggedIn,
      user,
      onboardingRole,
      onboardingHomeEntryIds,
      userHasBookings,
      homeEntryId_15_17,
      homeEntryIdWithoutBooking_15_17,
      userBookings?.hasBookingsAfter18,
      homeEntryId_18,
      homeEntryIdWithoutBooking_18,
      homeEntryIdGeneral,
    ]
  )
}

const getOnboardingHomepageEntryId = (
  onboardingRole: UserOnboardingRole,
  {
    homeEntryIdNotConnected,
    homeEntryIdOnboardingGeneral,
    homeEntryIdOnboardingUnderage,
    homeEntryIdOnboarding_18,
  }: Partial<CustomRemoteConfig>
) => {
  switch (onboardingRole) {
    case UserOnboardingRole.EIGHTEEN:
      return homeEntryIdOnboarding_18
    case UserOnboardingRole.UNDERAGE:
      return homeEntryIdOnboardingUnderage
    case UserOnboardingRole.NON_ELIGIBLE:
      return homeEntryIdOnboardingGeneral
    default:
      return homeEntryIdNotConnected
  }
}
