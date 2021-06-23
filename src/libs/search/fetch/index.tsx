import { useAppSettings } from 'features/auth/settings'

import { useAlgoliaMultipleHits } from './useAlgoliaMultipleHits'
import { useSearchMultipleHits } from './useSearchMultipleHits'

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
