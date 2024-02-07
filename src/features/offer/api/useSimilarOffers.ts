import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { SearchGroupNameEnumv2, SearchGroupResponseModelv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { SimilarOffersResponse } from 'features/offer/types'
import { usePrevious } from 'features/search/helpers/usePrevious'
import { env } from 'libs/environment'
import { Position } from 'libs/location'
import { eventMonitoring } from 'libs/monitoring'
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
  offerId?: number
  position?: Position
  searchGroupList?: SearchGroupResponseModelv2[]
}

export const getSimilarOffersEndpoint = (
  offerId?: number,
  userId?: number,
  position?: Position,
  categories?: SearchGroupNameEnumv2[]
): string | undefined => {
  if (!offerId) return

  const endpoint = `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${offerId}?`
  const urlParams = new URLSearchParams()

  urlParams.append('token', env.RECOMMENDATION_TOKEN)
  if (userId) urlParams.append('userId', String(userId))
  if (position?.latitude && position?.longitude) {
    urlParams.append('longitude', String(position.longitude))
    urlParams.append('latitude', String(position.latitude))
  }
  if (categories) categories.forEach((category) => urlParams.append('categories', category))

  return endpoint + urlParams.toString()
}

export const getApiRecoSimilarOffers = async (
  similarOffersEndpoint: string
): Promise<SimilarOffersResponse | undefined> => {
  try {
    const similarOffers = await fetch(similarOffersEndpoint)
    const json: SimilarOffersResponse = await similarOffers.json()

    return json
  } catch (e) {
    eventMonitoring.captureException(e)
    return undefined
  }
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
  position,
  categoryIncluded,
  categoryExcluded,
  searchGroupList,
}: Props) => {
  const categories: SearchGroupNameEnumv2[] = useMemo(
    () => getCategories(searchGroupList, categoryIncluded, categoryExcluded),
    [categoryExcluded, categoryIncluded, searchGroupList]
  )

  const { user: profile } = useAuthContext()
  const similarOffersEndpoint =
    getSimilarOffersEndpoint(offerId, profile?.id, position, categories) ?? ''

  const previousPosition = usePrevious(position)
  const previousCategoryExcluded = usePrevious(categoryExcluded)
  const previousCategoryIncluded = usePrevious(categoryIncluded)
  const hasSameCategoryExcluded = categoryExcluded === previousCategoryExcluded
  const hasSameCategoryIncluded = categoryIncluded === previousCategoryIncluded
  const hasSamePosition = JSON.stringify(previousPosition) === JSON.stringify(position)

  const { data: apiRecoResponse } = useQuery(
    [QueryKeys.SIMILAR_OFFERS, offerId, position, categories],
    () => getApiRecoSimilarOffers(similarOffersEndpoint),
    {
      enabled:
        !!similarOffersEndpoint ||
        (categoryExcluded && hasSameCategoryExcluded && hasSamePosition) ||
        (categoryIncluded && hasSameCategoryIncluded && hasSamePosition),
    }
  )

  return {
    similarOffers: useAlgoliaSimilarOffers(apiRecoResponse?.results ?? [], true),
    apiRecoParams: apiRecoResponse?.params,
  }
}
