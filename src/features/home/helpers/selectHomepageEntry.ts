import { omit } from 'lodash'
import { useCallback } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Homepage } from 'features/home/types'
import { UserOnboardingRole } from 'features/onboarding/enums'
import { useUserRoleFromOnboarding } from 'features/onboarding/helpers/useUserRoleFromOnboarding'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { isUserFreeBeneficiary } from 'features/profile/helpers/isUserFreeBeneficiary'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { useUserHasBookingsQuery } from 'queries/bookings'

const scoreHomepageByTags = (
  homepage: Homepage,
  user?: UserProfileResponseWithoutSurvey
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
  const userHasBookings = useUserHasBookingsQuery()
  const onboardingRole = useUserRoleFromOnboarding()
  const {
    data: {
      homeEntryIdGeneral,
      homeEntryIdBeneficiary,
      homeEntryIdFreeBeneficiary,
      homeEntryIdWithoutBooking,
    },
  } = useRemoteConfigQuery()

  return useCallback(
    (homepageList: Homepage[]): Homepage | undefined => {
      if (homepageList.length === 0) return

      // If no homepage is tagged, we show the last published one
      const firstHomepageEntry = homepageList[0]

      // If we are coming from a deeplink or firebase remote config we suppose the homepageEntryId exists
      if (homepageEntryId)
        return homepageList.find(({ id }) => id === homepageEntryId) ?? firstHomepageEntry

      const scoredEntries = homepageList
        .map((homepageEntry) => scoreHomepageByTags(homepageEntry, user))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)

      const defaultHomepageEntry = scoredEntries.length
        ? omit(scoredEntries[0], 'score')
        : firstHomepageEntry

      if (!isLoggedIn || !user) {
        const onboardingHomeEntryId = getOnboardingHomepageEntryId(onboardingRole, {
          homeEntryIdBeneficiary,
          homeEntryIdGeneral,
          homeEntryIdFreeBeneficiary,
        })

        return homepageList.find(({ id }) => id === onboardingHomeEntryId) ?? defaultHomepageEntry
      }

      if (isUserFreeBeneficiary(user)) {
        return (
          homepageList.find(({ id }) => id === homeEntryIdFreeBeneficiary) ?? defaultHomepageEntry
        )
      }

      if (isUserBeneficiary(user)) {
        if (userHasBookings) {
          return (
            homepageList.find(({ id }) => id === homeEntryIdBeneficiary) ?? defaultHomepageEntry
          )
        }
        return (
          homepageList.find(({ id }) => id === homeEntryIdWithoutBooking) ?? defaultHomepageEntry
        )
      }

      return homepageList.find(({ id }) => id === homeEntryIdGeneral) ?? defaultHomepageEntry
    },
    [
      homepageEntryId,
      isLoggedIn,
      user,
      onboardingRole,
      homeEntryIdBeneficiary,
      homeEntryIdGeneral,
      homeEntryIdFreeBeneficiary,
      userHasBookings,
      homeEntryIdWithoutBooking,
    ]
  )
}

const getOnboardingHomepageEntryId = (
  onboardingRole: UserOnboardingRole,
  {
    homeEntryIdBeneficiary,
    homeEntryIdGeneral,
    homeEntryIdFreeBeneficiary,
  }: Partial<CustomRemoteConfig>
) => {
  if (onboardingRole === UserOnboardingRole.EIGHTEEN) {
    return homeEntryIdBeneficiary
  }
  if (onboardingRole === UserOnboardingRole.UNDERAGE) {
    return homeEntryIdFreeBeneficiary
  }
  return homeEntryIdGeneral
}
