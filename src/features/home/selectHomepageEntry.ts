import omit from 'lodash/omit'
import { useCallback } from 'react'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserHasBookings } from 'features/bookings/api/useUserHasBookings'
import { HomepageEntry, TagId } from 'libs/contentful'
import { getAvailableCredit } from 'features/home/services/useAvailableCredit'
import {
  isUserBeneficiary18,
  isUserUnderage,
  isUserUnderageBeneficiary,
} from 'features/profile/utils'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'

const scoreHomepageByTags = (
  homepageEntry: HomepageEntry,
  user?: UserProfileResponse
): HomepageEntry & { score: number } => {
  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const tags: TagId[] = homepageEntry.metadata.tags.map(({ sys }) => sys.id)

  let score = 0
  if (tags.includes('master')) score += 5
  if (tags.includes('userunderage')) score += isUnderageBeneficiary ? 3 : -3
  if (tags.includes('usergrandpublic')) score += isUnderageBeneficiary ? -1 : 1
  return { ...homepageEntry, score }
}

// this creates a selector to pick the adequate homepage to show
export const useSelectHomepageEntry = (homepageEntryId?: string) => {
  const { isLoggedIn, user } = useAuthContext()
  const userHasBookings = useUserHasBookings()
  const {
    homeEntryIdNotConnected,
    homeEntryIdGeneral,
    homeEntryIdWithoutBooking_18,
    homeEntryIdWithoutBooking_15_17,
    homeEntryId_18,
    homeEntryId_15_17,
  } = useRemoteConfigContext()

  return useCallback(
    (homepageEntries: HomepageEntry[]): HomepageEntry | undefined => {
      if (homepageEntries.length === 0) return

      // If no homepage is tagged, we show the last published one
      const firstHomepageEntry = homepageEntries[0]

      // If we are coming from a deeplink or firebase remote config we suppose the homepageEntryId exists
      if (homepageEntryId)
        return homepageEntries.find(({ sys }) => sys.id === homepageEntryId) || firstHomepageEntry

      const scoredEntries = homepageEntries
        .map((homepageEntry) => scoreHomepageByTags(homepageEntry, user))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)

      const defaultHomepageEntry = scoredEntries.length
        ? omit(scoredEntries[0], 'score')
        : firstHomepageEntry

      if (!isLoggedIn || !user) {
        return (
          homepageEntries.find(({ sys }) => sys.id === homeEntryIdNotConnected) ||
          defaultHomepageEntry
        )
      }

      if (isUserUnderage(user)) {
        if (userHasBookings) {
          return (
            homepageEntries.find(({ sys }) => sys.id === homeEntryId_15_17) || defaultHomepageEntry
          )
        }
        return (
          homepageEntries.find(({ sys }) => sys.id === homeEntryIdWithoutBooking_15_17) ||
          defaultHomepageEntry
        )
      }

      const credit = getAvailableCredit(user)
      if (user?.eligibility === 'age-18' || (isUserBeneficiary18(user) && !credit.isExpired)) {
        if (userHasBookings) {
          return (
            homepageEntries.find(({ sys }) => sys.id === homeEntryId_18) || defaultHomepageEntry
          )
        }
        return (
          homepageEntries.find(({ sys }) => sys.id === homeEntryIdWithoutBooking_18) ||
          defaultHomepageEntry
        )
      }

      return (
        homepageEntries.find(({ sys }) => sys.id === homeEntryIdGeneral) || defaultHomepageEntry
      )
    },
    [
      user,
      homepageEntryId,
      homeEntryIdNotConnected,
      homeEntryIdGeneral,
      homeEntryIdWithoutBooking_18,
      homeEntryIdWithoutBooking_15_17,
      homeEntryId_18,
      homeEntryId_15_17,
      isLoggedIn,
      userHasBookings,
    ]
  )
}
