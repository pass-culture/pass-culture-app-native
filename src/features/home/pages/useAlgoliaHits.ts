import flatten from 'lodash.flatten'
import uniqBy from 'lodash.uniqby'
import { useCallback } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'
import { useQuery } from 'react-query'

import { AlgoliaParametersFields } from 'features/home/contentful'
import { AlgoliaHit, parseAlgoliaParameters, ParsedAlgoliaParameters } from 'libs/algolia'
import {
  fetchMultipleAlgolia,
  filterAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'
import { QueryKeys } from 'libs/queryKeys'

const isParsedParameter = (parameter: unknown): parameter is ParsedAlgoliaParameters =>
  typeof parameter === 'object' && parameter !== null

interface AlgoliaHits {
  hits: AlgoliaHit[]
  nbHits: number
}

export const useAlgoliaHits = (
  algolia: AlgoliaParametersFields[],
  moduleId: string,
  position: GeoCoordinates | null
): AlgoliaHits => {
  const transformAlgoliaHit = useTransformAlgoliaHits()

  const algoliaQuery = useCallback(async () => {
    const parsedParameters = algolia
      .map((parameters) => parseAlgoliaParameters({ geolocation: position, parameters }))
      .filter(isParsedParameter)

    const response = await fetchMultipleAlgolia(parsedParameters)
    return { moduleId: moduleId, ...response }
  }, [!!position])

  const { data } = useQuery([QueryKeys.ALGOLIA_MODULE, moduleId], algoliaQuery, {
    enabled: algolia[0].isGeolocated ? !!position : true,
  })
  const { results = [] } = data || { results: [] }

  const hits = flatten(results.map(({ hits }) => hits))
  const nbHits = results.reduce((prev, curr) => prev + curr.nbHits, 0)

  return {
    hits: uniqBy(hits.filter(filterAlgoliaHit).map(transformAlgoliaHit), 'objectID'),
    nbHits,
  }
}
