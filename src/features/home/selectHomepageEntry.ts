import omit from 'lodash/omit'
import { useCallback } from 'react'

import { UserProfileResponse } from 'api/gen'
import { HomepageEntry, TagId } from 'features/home/contentful'
import { useUserProfileInfo } from 'features/profile/api'
import { isUserUnderageBeneficiary } from 'features/profile/utils'

const scoreHomepageByTags = (
  homepageEntry: HomepageEntry,
  user?: UserProfileResponse
): HomepageEntry & { score: number } => {
  const isUnderage = isUserUnderageBeneficiary(user)
  const tags: TagId[] = homepageEntry.metadata.tags.map(({ sys }) => sys.id)

  let score = 0
  if (tags.includes('master')) score += 5
  if (tags.includes('userunderage')) score += isUnderage ? 3 : -3
  if (tags.includes('usergrandpublic')) score += isUnderage ? -1 : 1
  return { ...homepageEntry, score }
}

// this creates a selector to pick the adequate homepage to show
export const useSelectHomepageEntry = (homepageEntryId?: string) => {
  const { data: user } = useUserProfileInfo()

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

      return scoredEntries.length ? omit(scoredEntries[0], 'score') : firstHomepageEntry
    },
    [user, homepageEntryId]
  )
}
