import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { isAPIExceptionNotCaptured } from 'api/apiHelpers'
import { ThematicSearchCategories } from 'features/navigation/navigators/SearchStackNavigator/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { QueryKeys } from 'libs/queryKeys'

type Props = {
  searchGroupName?: ThematicSearchCategories
  enabled?: boolean
}

export const useTopArtistsPlaylistQuery = ({ searchGroupName, enabled = true }: Props) => {
  return useQuery({
    queryKey: [QueryKeys.TOP_ARTISTS_PLAYLIST, searchGroupName],
    queryFn: async () => {
      if (!searchGroupName) {
        return { artists: [] }
      }

      try {
        return await api.getNativeV1RecommendationTopArtistsPlaylistsearchGroupName(searchGroupName)
      } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 'unknown'
        const errorMessage = err instanceof Error ? err.message : JSON.stringify(err)
        const shouldApiErrorNotCaptured = Boolean(
          err instanceof ApiError && isAPIExceptionNotCaptured(err.statusCode)
        )

        if (!shouldApiErrorNotCaptured) {
          eventMonitoring.captureException(
            new Error(`Error ${statusCode} with top artists playlist endpoint`),
            {
              extra: {
                searchGroupName,
                statusCode,
                errorMessage,
              },
            }
          )
        }

        return { artists: [] }
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!searchGroupName && enabled,
  })
}
