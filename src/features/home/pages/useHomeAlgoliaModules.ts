import { SearchResponse } from '@algolia/client-search'
import { useState } from 'react'
import { useQueries } from 'react-query'

import { Offers, OffersWithCover } from 'features/home/contentful'
import { AlgoliaHit, parseAlgoliaParameters, SearchAlgoliaHit } from 'libs/algolia'
import { fetchAlgolia } from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { convertAlgoliaHitToCents } from 'libs/parsers/pricesConversion'
import { QueryKeys } from 'libs/queryKeys'

export type AlgoliaModuleResponse = {
  [moduleId: string]: {
    hits: AlgoliaHit[]
    nbHits: number
  }
}

const isAlgoliaModule = (
  response: unknown
): response is SearchResponse<AlgoliaHit> & { moduleId: string } => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'hits' in response &&
    'nbHits' in response &&
    'moduleId' in response
  )
}

export const filterAlgoliaHit = (hit: AlgoliaHit): boolean =>
  hit && hit.offer && !!hit.offer.thumbUrl

// https://github.com/pass-culture/pass-culture-api/blob/6b2b07be32f92bd37ad6c08158765a8098665cce/src/pcapi/algolia/infrastructure/builder.py#L90
// The _geoloc is hardcoded for digital offers (without position) so that the results appear in the Search:
// original PR: https://github.com/pass-culture/pass-culture-api/pull/1334
// Here we dehardcode those coordinates, so that we don't show a wrong distance to the user.
export const formatAlgoliaHit = <Hit extends AlgoliaHit | SearchAlgoliaHit>(hit: Hit): Hit => ({
  ...convertAlgoliaHitToCents(hit),
  _geoloc: hit.offer.isDigital ? { lat: null, lng: null } : hit._geoloc,
})

export const useHomeAlgoliaModules = (
  offerModules: Array<Offers | OffersWithCover>
): AlgoliaModuleResponse => {
  const { position, positionReceived } = useGeolocation()
  const [algoliaModules, setAlgoliaModules] = useState<AlgoliaModuleResponse>({})

  useQueries(
    offerModules.map(({ algolia, moduleId }) => {
      const parsedParameters = parseAlgoliaParameters({
        geolocation: position,
        parameters: algolia,
      })

      const fetchModule = async () => {
        if (!parsedParameters) return undefined
        const response = await fetchAlgolia<AlgoliaHit>(parsedParameters)
        return { moduleId: moduleId, ...response }
      }

      return {
        queryKey: [QueryKeys.ALGOLIA_MODULE, moduleId],
        queryFn: fetchModule,
        onSuccess: (data) => {
          if (isAlgoliaModule(data)) {
            setAlgoliaModules((prevAlgoliaModules) => ({
              ...prevAlgoliaModules,
              [data.moduleId]: {
                hits: data.hits.filter(filterAlgoliaHit).map(formatAlgoliaHit),
                nbHits: data.nbHits,
              },
            }))
          }
        },
        enabled: positionReceived,
      }
    })
  )

  return algoliaModules
}
