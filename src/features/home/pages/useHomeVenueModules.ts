import { useEffect } from 'react'
import { useQueries, UseInfiniteQueryOptions } from 'react-query'

import { VenuesModule } from 'features/home/contentful'
import { fetchMultipleVenues } from 'libs/algolia/fetchAlgolia/fetchMultipleVenues'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { VenueHit } from 'libs/search'

export type HomeVenuesModuleResponse = {
  [moduleId: string]: {
    hits: VenueHit[]
    nbHits: number
  }
}

export const useHomeVenueModules = (
  venuesModules: Array<VenuesModule>
): HomeVenuesModuleResponse => {
  const { position } = useGeolocation()
  const homeVenuesModules: HomeVenuesModuleResponse = {}

  const queries = useQueries(
    venuesModules.map(({ search, moduleId }) => {
      const fetchModule = async () => {
        const hits = await fetchMultipleVenues(search, position)
        return { moduleId: moduleId, hits }
      }

      return {
        queryKey: [QueryKeys.HOME_VENUES_MODULE, moduleId],
        queryFn: fetchModule,
        notifyOnChangeProps: ['data'] as UseInfiniteQueryOptions['notifyOnChangeProps'],
      }
    })
  )

  queries.forEach((query) => {
    if (!query.isSuccess) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = query.data as any

    homeVenuesModules[data.moduleId] = {
      hits: data.hits,
      nbHits: data.hits.length,
    }
  })

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    queries.forEach(({ refetch }) => {
      refetch()
    })
  }, [!!position])

  return homeVenuesModules
}
