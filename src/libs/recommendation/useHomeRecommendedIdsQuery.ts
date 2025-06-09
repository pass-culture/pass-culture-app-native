import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { isAPIExceptionNotCaptured } from 'api/apiHelpers'
import { PlaylistRequestBody, PlaylistRequestQuery } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { eventMonitoring } from 'libs/monitoring/services'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

type Parameters = {
  playlistRequestBody: PlaylistRequestBody
  playlistRequestQuery: PlaylistRequestQuery
  shouldFetch: boolean
  userId?: number
}

export const useHomeRecommendedIdsQuery = (parameters: Parameters) => {
  const { playlistRequestBody, playlistRequestQuery, userId, shouldFetch } = parameters
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
        const shouldApiErrorNotCaptured =
          Boolean(err instanceof ApiError && isAPIExceptionNotCaptured(err.statusCode)) ||
          Boolean(err instanceof Error && err.message === 'Network request failed')

        if (!shouldApiErrorNotCaptured) {
          logError(err, parameters)
        }

        return { playlistRecommendedOffers: [], params: undefined }
      }
    },
    {
      staleTime: 1000 * 60 * 5,
      enabled:
        isLoggedIn &&
        !!userId &&
        !!netInfo.isConnected &&
        !!netInfo.isInternetReachable &&
        shouldFetch,
    }
  )
}

const logError = (err: unknown, parameters: Parameters): void => {
  const { title, statusCode, errorMessage } = getErrorDetails(err)

  eventMonitoring.captureException(new Error(`Error ${title} with recommendation endpoint`), {
    extra: {
      playlistRequestBody: JSON.stringify(parameters.playlistRequestBody),
      playlistRequestQuery: JSON.stringify(parameters.playlistRequestQuery),
      statusCode,
      errorMessage,
    },
  })
}

const getErrorDetails = (
  err: unknown
): { title: string; statusCode: string; errorMessage: string } => {
  if (err instanceof ApiError) {
    return {
      title: `${err.statusCode}`,
      statusCode: `${err.statusCode}`,
      errorMessage: err.message,
    }
  }

  if (err instanceof Error) {
    return {
      title: err.message,
      statusCode: 'unknown',
      errorMessage: err.message,
    }
  }

  return {
    title: 'unknown',
    statusCode: 'unknown',
    errorMessage: JSON.stringify(err),
  }
}
