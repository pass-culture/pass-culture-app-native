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
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit, useParseSearchParameters } from 'libs/search'

export type HomeModuleResponse = {
  [moduleId: string]: {
    hits: SearchHit[]
    nbHits: number
  }
}

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
  const { position } = useGeolocation()
  const transformHits = useTransformAlgoliaHits()
  const parseSearchParameters = useParseSearchParameters()
  const isUserUnderage = useIsUserUnderage()
  const { data: user } = useUserProfileInfo()

  const parsedParameters = search.map(parseSearchParameters).filter(isSearchState)

  const { data, refetch } = useQuery(
    [QueryKeys.HOME_MODULE, moduleId],
    async () => await fetchMultipleAlgolia(parsedParameters, position, isUserUnderage)
  )

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    refetch()
  }, [!!position, user?.isBeneficiary])

  return useMemo(() => {
    if (!data) return

    const hits = data.hits.filter(filterAlgoliaHit).map(transformHits)
    return {
      hits: uniqBy(hits, 'objectID') as SearchHit[],
      nbHits: data.nbHits,
    }
  }, [data, !!position, transformHits])
}
