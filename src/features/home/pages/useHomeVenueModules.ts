import { useEffect } from 'react'
import { useQueries } from 'react-query'

import { VenuesModule } from 'features/home/contentful'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { VenueHit } from 'libs/search'
import { fetchMultipleVenues } from 'libs/search/fetch/search'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'

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
  const { enabled, isAppSearchBackend } = useAppSearchBackend()

  const queries = useQueries(
    venuesModules.map(({ search: _search, moduleId }) => {
      const fetchModule = async () => {
        // TODO(antoinewg): use search parameters (venueTypes, etc...)
        const hits = await fetchMultipleVenues()
        return { moduleId: moduleId, hits }
      }

      return {
        queryKey: [QueryKeys.HOME_VENUES_MODULE, moduleId],
        queryFn: fetchModule,
        enabled: enabled && isAppSearchBackend,
        notifyOnChangeProps: ['data'],
      }
    })
  )

  queries.forEach((query) => {
    if (!query.isSuccess) return
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
