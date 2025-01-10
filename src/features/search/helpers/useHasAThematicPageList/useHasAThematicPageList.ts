import { SearchGroupNameEnumv2 } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useHasAThematicPageList = () => {
  const enableWipPageThematicSearchBooks = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_PAGE_SEARCH_N1
  )
  const enableWipPageThematicSearchCinema = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_SEARCH_N1_CINEMA
  )
  const enableWipPageThematicSearchFilmsDocumentairesEtSeries = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_SEARCH_N1_FILMS_DOCUMENTAIRES_ET_SERIES
  )
  const enableWipPageThematicSearchMusic = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_THEMATIC_SEARCH_MUSIC
  )
  return [
    enableWipPageThematicSearchBooks ? SearchGroupNameEnumv2.LIVRES : undefined,
    enableWipPageThematicSearchCinema ? SearchGroupNameEnumv2.CINEMA : undefined,
    enableWipPageThematicSearchFilmsDocumentairesEtSeries
      ? SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES
      : undefined,
    enableWipPageThematicSearchMusic ? SearchGroupNameEnumv2.MUSIQUE : undefined,
  ]
}
