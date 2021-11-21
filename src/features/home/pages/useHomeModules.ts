import uniqBy from 'lodash.uniqby'
import { useEffect } from 'react'
import { UseInfiniteQueryOptions, useQueries } from 'react-query'

import { Offers, OffersWithCover } from 'features/home/contentful'
import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { SearchState } from 'features/search/types'
import {
  fetchMultipleAlgolia,
  filterAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit, useParseSearchParameters } from 'libs/search'
import { fetchMultipleHits as searchMultipleHits, filterSearchHits } from 'libs/search/fetch/search'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'

export type HomeModuleResponse = {
  [moduleId: string]: {
    hits: SearchHit[]
    nbHits: number
  }
}

const isSearchState = (parameter: unknown): parameter is SearchState =>
  typeof parameter === 'object' && parameter !== null

export const useHomeModules = (
  offerModules: Array<Offers | OffersWithCover>
): HomeModuleResponse => {
  const { position } = useGeolocation()
  const homeModules: HomeModuleResponse = {}
  const { enabled, isAppSearchBackend } = useAppSearchBackend()
  const transformHits = useTransformAlgoliaHits()
  const parseSearchParameters = useParseSearchParameters()
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()

  const fetchMultipleHits = isAppSearchBackend ? searchMultipleHits : fetchMultipleAlgolia
  const filterHits = isAppSearchBackend ? filterSearchHits : filterAlgoliaHit

  const queries = useQueries(
    offerModules.map(({ search, moduleId }) => {
      const parsedParameters = search.map(parseSearchParameters).filter(isSearchState)

      const fetchModule = async () => {
        const response = await fetchMultipleHits(
          parsedParameters,
          position,
          isUserUnderageBeneficiary
        )
        return { moduleId: moduleId, ...response }
      }

      return {
        queryKey: [QueryKeys.HOME_MODULE, moduleId],
        queryFn: fetchModule,
        enabled,
        notifyOnChangeProps: ['data'] as UseInfiniteQueryOptions['notifyOnChangeProps'],
      }
    })
  )

  queries.forEach((query) => {
    if (!query.isSuccess) return
    const data = query.data as { moduleId: string; hits: SearchHit[]; nbHits: number }

    homeModules[data.moduleId] = {
      hits: uniqBy(data.hits.filter(filterHits).map(transformHits), 'objectID') as SearchHit[],
      nbHits: data.nbHits,
    }
  })

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    queries.forEach(({ refetch }) => {
      refetch()
    })
  }, [!!position])

  return homeModules
}
