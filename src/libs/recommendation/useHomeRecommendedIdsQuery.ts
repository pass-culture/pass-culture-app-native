import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { isAPIExceptionNotCaptured } from 'api/apiHelpers'
import { PlaylistRequestBody, PlaylistRequestQuery } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

type Parameters = {
  playlistRequestBody: PlaylistRequestBody
  playlistRequestQuery: PlaylistRequestQuery
  userId?: number
}

export const useHomeRecommendedIdsQuery = (parameters: Parameters) => {
  const { playlistRequestBody, playlistRequestQuery, userId } = parameters
  const { modelEndpoint, longitude, latitude } = playlistRequestQuery
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()

  return useQuery(
    [QueryKeys.RECOMMENDATION_OFFER_IDS, parameters],
    async () => {
      try {
        return await api.postNativeV1RecommendationPlaylist(
          playlistRequestBody,
          modelEndpoint ?? undefined,
          longitude ?? undefined,
          latitude ?? undefined
        )
      } catch (err) {
        const shouldApiErrorNotCaptured = Boolean(
          err instanceof ApiError && isAPIExceptionNotCaptured(err.statusCode)
        )

        if (!shouldApiErrorNotCaptured) {
          logError(err, parameters)
        }

        return { playlistRecommendedOffers: [], params: undefined }
      }
    },
    {
      staleTime: 1000 * 60 * 5,
      enabled: isLoggedIn && !!userId && !!netInfo.isConnected,
    }
  )
}

const logError = (err: unknown, parameters: Parameters): void => {
  if (err instanceof ApiError) {
    const statusCode = err.statusCode
    const title = err.statusCode
    const errorMessage = err.message

    eventMonitoring.captureException(new Error(`Error ${title} with recommendation endpoint`), {
      extra: {
        playlistRequestBody: JSON.stringify(parameters.playlistRequestBody),
        playlistRequestQuery: JSON.stringify(parameters.playlistRequestQuery),
        statusCode,
        errorMessage,
      },
    })
    return
  }

  if (err instanceof Error) {
    const statusCode = 'unknown'
    const title = err.message
    const errorMessage = err.message

    eventMonitoring.captureException(new Error(`Error ${title} with recommendation endpoint`), {
      extra: {
        playlistRequestBody: JSON.stringify(parameters.playlistRequestBody),
        playlistRequestQuery: JSON.stringify(parameters.playlistRequestQuery),
        statusCode,
        errorMessage,
      },
    })
    return
  }

  const statusCode = 'unknown'
  const title = 'unknown'
  const errorMessage = JSON.stringify(err)

  eventMonitoring.captureException(new Error(`Error ${title} with recommendation endpoint`), {
    extra: {
      playlistRequestBody: JSON.stringify(parameters.playlistRequestBody),
      playlistRequestQuery: JSON.stringify(parameters.playlistRequestQuery),
      statusCode,
      errorMessage,
    },
  })
}
