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
    enableWipPageThematicSearchBooks ? 'LIVRES' : undefined,
    enableWipPageThematicSearchCinema ? 'CINEMA' : undefined,
    enableWipPageThematicSearchFilmsDocumentairesEtSeries
      ? 'FILMS_DOCUMENTAIRES_SERIES'
      : undefined,
    enableWipPageThematicSearchMusic ? 'MUSIQUE' : undefined,
  ]
}
