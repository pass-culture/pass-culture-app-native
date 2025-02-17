import { SearchGroupNameEnumv2 } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useHasAThematicPageList = () => {
  const enableWipPageThematicSearchConcertsAndFestivals = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_THEMATIC_SEARCH_CONCERTS_AND_FESTIVALS
  )
  return [
    SearchGroupNameEnumv2.LIVRES,
    SearchGroupNameEnumv2.CINEMA,
    SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
    SearchGroupNameEnumv2.MUSIQUE,
    enableWipPageThematicSearchConcertsAndFestivals
      ? SearchGroupNameEnumv2.CONCERTS_FESTIVALS
      : undefined,
  ]
}
