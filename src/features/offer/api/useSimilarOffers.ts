import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { isAPIExceptionNotCaptured } from 'api/apiHelpers'
import { SearchGroupNameEnumv2, SearchGroupResponseModelv2 } from 'api/gen'
import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { Position } from 'libs/location'
import { eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

type WithIncludeCategoryProps = {
  categoryIncluded: SearchGroupNameEnumv2
  categoryExcluded?: never
}

type WithExcludeCategoryProps = {
  categoryIncluded?: never
  categoryExcluded: SearchGroupNameEnumv2
}

type Props = (WithIncludeCategoryProps | WithExcludeCategoryProps) & {
  offerId: number
  shouldFetch: boolean
  position?: Position
  searchGroupList?: SearchGroupResponseModelv2[]
}

export const getCategories = (
  searchGroups?: SearchGroupResponseModelv2[],
  categoryIncluded?: SearchGroupNameEnumv2,
  categoryExcluded?: SearchGroupNameEnumv2
) => {
  if (categoryIncluded) {
    return [categoryIncluded]
  }

  if (categoryExcluded && searchGroups) {
    return searchGroups
      .filter(
        (searchGroup) =>
          searchGroup.name !== categoryExcluded && searchGroup.name !== SearchGroupNameEnumv2.NONE
      )
      .map((searchGroup) => searchGroup.name)
  }

  return []
}

export const useSimilarOffers = ({
  offerId,
  shouldFetch,
  position,
  categoryIncluded,
  categoryExcluded,
  searchGroupList,
}: Props) => {
  const netInfo = useNetInfoContext()

  const categories: SearchGroupNameEnumv2[] = useMemo(
    () => getCategories(searchGroupList, categoryIncluded, categoryExcluded),
    [categoryExcluded, categoryIncluded, searchGroupList]
  )

  const { data: apiRecoResponse } = useQuery(
    [QueryKeys.SIMILAR_OFFERS_IDS, offerId, position, categories],
    async () => {
      try {
        return await api.getNativeV1RecommendationSimilarOffersofferId(
          offerId,
          position?.longitude,
          position?.latitude,
          categories
        )
      } catch (err) {
        const statusCode = err instanceof ApiError ? err.statusCode : 'unknown'
        const errorMessage = err instanceof Error ? err.message : JSON.stringify(err)
        const shouldApiErrorNotCaptured = Boolean(
          err instanceof ApiError && isAPIExceptionNotCaptured(err.statusCode)
        )

        if (!shouldApiErrorNotCaptured) {
          eventMonitoring.captureException(
            new Error(`Error ${statusCode} with recommendation endpoint to get similar offers`),
            {
              extra: {
                offerId,
                longitude: position?.longitude,
                latitude: position?.latitude,
                categories: JSON.stringify(categories),
                statusCode,
                errorMessage,
              },
            }
          )
        }

        return { params: {}, results: [] }
      }
    },
    {
      staleTime: 1000 * 60 * 5,
      enabled:
        !!categories && !!netInfo.isConnected && !!netInfo.isInternetReachable && shouldFetch,
    }
  )

  return {
    similarOffers: useAlgoliaSimilarOffers(apiRecoResponse?.results ?? [], true),
    apiRecoParams: apiRecoResponse?.params,
  }
}
