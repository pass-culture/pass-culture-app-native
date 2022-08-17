import uniqBy from 'lodash/uniqBy'
import { useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'

import { SearchParametersFields } from 'features/home/contentful'
import { useUserProfileInfo } from 'features/profile/api'
import { useIsUserUnderage } from 'features/profile/utils'
import { SearchState } from 'features/search/types'
import {
  fetchMultipleOffers,
  filterOfferHit,
  useTransformOfferHits,
} from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit, useParseSearchParameters } from 'libs/search'

const isSearchState = (parameter: unknown): parameter is SearchState =>
  typeof parameter === 'object' && parameter !== null

interface UseOfferModuleProps {
  search: SearchParametersFields[]
  moduleId: string
}

export const useOfferModule = ({
  search,
  moduleId,
}: UseOfferModuleProps): { hits: SearchHit[]; nbHits: number } | undefined => {
  const { position } = useGeolocation()
  const transformHits = useTransformOfferHits()
  const parseSearchParameters = useParseSearchParameters()
  const isUserUnderage = useIsUserUnderage()
  const { data: user } = useUserProfileInfo()
  const netInfo = useNetInfoContext()
  const parsedParameters = search.map(parseSearchParameters).filter(isSearchState)

  const { data, refetch } = useQuery(
    [QueryKeys.HOME_MODULE, moduleId],
    async () =>
      await fetchMultipleOffers({
        paramsList: parsedParameters,
        userLocation: position,
        isUserUnderage,
      }),
    { enabled: !!netInfo.isConnected }
  )

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position, user?.isBeneficiary])

  return useMemo(() => {
    if (!data) return

    const hits = data.hits.filter(filterOfferHit).map(transformHits)
    return {
      hits: uniqBy(hits, 'objectID') as SearchHit[],
      nbHits: data.nbHits,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, !!position, transformHits])
}
