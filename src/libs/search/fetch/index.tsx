import { useAppSettings } from 'features/auth/settings'

import { useAlgoliaHits } from './useAlgoliaHits'
import { useAlgoliaMultipleHits } from './useAlgoliaMultipleHits'
import { useAlgoliaQuery } from './useAlgoliaQuery'
import { useSearchHits } from './useSearchHits'
import { useSearchMultipleHits } from './useSearchMultipleHits'
import { useSearchQuery } from './useSearchQuery'

// Home page: module contentful with multiple parameters
export const useFetchMultipleHits = () => {
  const { data: settings } = useAppSettings()
  const algoliaMultipleHits = useAlgoliaMultipleHits()
  const searchMultipleHits = useSearchMultipleHits()

  return {
    enabled: !!settings,
    ...(settings?.useAppSearch ? searchMultipleHits : algoliaMultipleHits),
  }
}

// Recommendation module
export const useFetchHits = () => {
  const { data: settings } = useAppSettings()
  const algoliaHits = useAlgoliaHits()
  const searchHits = useSearchHits()

  return {
    enabled: !!settings,
    ...(settings?.useAppSearch ? searchHits : algoliaHits),
  }
}

// Search page
export const useFetchQuery = () => {
  const { data: settings } = useAppSettings()
  const algoliaQuery = useAlgoliaQuery()
  const searchQuery = useSearchQuery()

  return {
    enabled: !!settings,
    ...(settings?.useAppSearch ? searchQuery : algoliaQuery),
  }
}
