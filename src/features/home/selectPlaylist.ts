import omit from 'lodash.omit'
import { useCallback } from 'react'

import { UserProfileResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { HomepageEntry, TagId } from 'features/home/contentful'
import { isUserUnderageBeneficiary } from 'features/profile/utils'

const scorePlaylistByTags = (
  entry: HomepageEntry,
  user?: UserProfileResponse
): HomepageEntry & { score: number } => {
  const isUnderage = isUserUnderageBeneficiary(user)
  const tags: TagId[] = entry.metadata.tags.map(({ sys }) => sys.id)

  let score = 0
  if (tags.includes('master')) score += 5
  if (tags.includes('userunderage')) score += isUnderage ? 3 : -3
  if (tags.includes('usergrandpublic')) score += isUnderage ? -1 : 1
  return { ...entry, score }
}

export const useSelectPlaylist = (entryId?: string) => {
  const { data: user } = useUserProfileInfo()

  return useCallback(
    (entries: HomepageEntry[]): HomepageEntry | undefined => {
      if (entries.length === 0) return

      // If no playlist is tagged, we show the last published homepage.
      const firstEntry = entries[0]

      // If we are coming from a deeplink, we suppose the entryId exists
      if (entryId) return entries.find(({ sys }) => sys.id === entryId) || firstEntry

      const scoredEntries = entries
        .map((entry) => scorePlaylistByTags(entry, user))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)

      return scoredEntries.length ? omit(scoredEntries[0], 'score') : firstEntry
    },
    [user, entryId]
  )
}
