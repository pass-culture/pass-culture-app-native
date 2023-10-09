import { useCallback, useEffect, useMemo, useState } from 'react'

import { Coordinates, SearchGroupNameEnumv2, SearchGroupResponseModelv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { getIsLoadedOfferPosition } from 'features/offer/helpers/getIsLoadedOfferPosition/getIsLoadedOfferPosition'
import { SimilarOffersResponse } from 'features/offer/types'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

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
  position?: Coordinates
}

export const getSimilarOffersEndpoint = (
  offerId?: number,
  userId?: number,
  position?: Coordinates,
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

export const getApiRecoSimilarOffers = async (similarOffersEndpoint: string) => {
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
}: Props) => {
  const { data } = useSubcategories()

  const categories: SearchGroupNameEnumv2[] = useMemo(
    () => getCategories(data?.searchGroups, categoryIncluded, categoryExcluded),
    [categoryExcluded, categoryIncluded, data?.searchGroups]
  )

  const { user: profile } = useAuthContext()
  // API called when offer position loaded
  const isLoadedOfferPosition = getIsLoadedOfferPosition(position)
  const similarOffersEndpoint = getSimilarOffersEndpoint(offerId, profile?.id, position, categories)
  const [apiRecoResponse, setApiRecoResponse] = useState<SimilarOffersResponse>()

  const fetchApiReco = useCallback(async () => {
    if (!similarOffersEndpoint || !isLoadedOfferPosition) return

    setApiRecoResponse(await getApiRecoSimilarOffers(similarOffersEndpoint))
  }, [isLoadedOfferPosition, similarOffersEndpoint])

  useEffect(() => {
    fetchApiReco()
  }, [fetchApiReco])

  return {
    similarOffers: useAlgoliaSimilarOffers(apiRecoResponse?.results ?? [], true),
    apiRecoParams: apiRecoResponse?.params,
  }
}
