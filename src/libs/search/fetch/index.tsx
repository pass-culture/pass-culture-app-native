import { useAppSettings } from 'features/auth/settings'

import { useAlgoliaHits } from './useAlgoliaHits'
import { useAlgoliaMultipleHits } from './useAlgoliaMultipleHits'
import { useAlgoliaQuery } from './useAlgoliaQuery'
import { useSearchHits } from './useSearchHits'
import { useSearchMultipleHits } from './useSearchMultipleHits'
import { useSearchQuery } from './useSearchQuery'

const useAppSearchBackend = () => {
  const { data: settings } = useAppSettings()
  // This is to make sure we do not have to force the update of the application
  // once we remove `useAppSearch` from the /settings endpoint. By that time,
  // App Search will be the default search backend
  const isAppSearchBackend = settings?.useAppSearch ?? true

  return { enabled: !!settings, isAppSearchBackend }
}

// Home page: module contentful with multiple parameters
export const useFetchMultipleHits = () => {
  const { enabled, isAppSearchBackend } = useAppSearchBackend()
  const algoliaMultipleHits = useAlgoliaMultipleHits()
  const searchMultipleHits = useSearchMultipleHits()

  return { enabled, ...(isAppSearchBackend ? searchMultipleHits : algoliaMultipleHits) }
}

// Recommendation module
export const useFetchHits = () => {
  const { enabled, isAppSearchBackend } = useAppSearchBackend()
  const algoliaHits = useAlgoliaHits()
  const searchHits = useSearchHits()

  return { enabled, ...(isAppSearchBackend ? searchHits : algoliaHits) }
}

// Search page
export const useFetchQuery = () => {
  const { enabled, isAppSearchBackend } = useAppSearchBackend()
  const algoliaQuery = useAlgoliaQuery()
  const searchQuery = useSearchQuery()

  return { enabled, ...(isAppSearchBackend ? searchQuery : algoliaQuery) }
}
