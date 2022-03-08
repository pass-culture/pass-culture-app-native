import uniqBy from 'lodash.uniqby'
import { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'

import { useUserProfileInfo } from 'features/home/api'
import { SearchParametersFields } from 'features/home/contentful'
import { useIsUserUnderage } from 'features/profile/utils'
import { SearchState } from 'features/search/types'
import {
  fetchMultipleAlgolia,
  filterAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { useNetwork } from 'libs/network/useNetwork'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit, useParseSearchParameters } from 'libs/search'

const isSearchState = (parameter: unknown): parameter is SearchState =>
  typeof parameter === 'object' && parameter !== null

interface useOfferModuleProps {
  search: SearchParametersFields[]
  moduleId: string
}

export const useOfferModule = ({
  search,
  moduleId,
}: useOfferModuleProps): { hits: SearchHit[]; nbHits: number } | undefined => {
  const { isConnected } = useNetwork()
  const { position } = useGeolocation()
  const transformHits = useTransformAlgoliaHits()
  const parseSearchParameters = useParseSearchParameters()
  const isUserUnderage = useIsUserUnderage()
  const { data: user } = useUserProfileInfo()

  const parsedParameters = search.map(parseSearchParameters).filter(isSearchState)

  const { data, refetch } = useQuery(
    [QueryKeys.HOME_MODULE, moduleId],
    async () => await fetchMultipleAlgolia(parsedParameters, position, isUserUnderage),
    {
      enabled: isConnected,
      staleTime: 1000 * 60, // 1 min
    }
  )

  useEffect(() => {
    if (!isConnected) return
    // When we enable or disable the geolocation, we want to refetch the home modules
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position, user?.isBeneficiary, isConnected])

  return useMemo(() => {
    if (!data) return

    const hits = data.hits.filter(filterAlgoliaHit).map(transformHits)
    return {
      hits: uniqBy(hits, 'objectID') as SearchHit[],
      nbHits: data.nbHits,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, !!position, transformHits])
}
