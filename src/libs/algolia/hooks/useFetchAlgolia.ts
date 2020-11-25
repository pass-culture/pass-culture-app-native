import { SearchResponse, Hit } from '@algolia/client-search'
import { useState } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'
import { useQuery } from 'react-query'

import { AlgoliaParametersFields } from 'features/home/contentful'

import { AlgoliaHit } from '../algolia'
import { fetchAlgolia } from '../fetchAlgolia'
import { parseAlgoliaParameters } from '../parseAlgoliaParameters'
import { ExtraAlgoliaParameters, FetchAlgoliaParameters } from '../types'

export interface UseFetchAlgoliaInterface {
  algoliaParameters: AlgoliaParametersFields
  extraParameters?: Partial<ExtraAlgoliaParameters>
  onSuccess?: (data: SearchResponse<AlgoliaHit> | undefined) => void
  onError?: (error: unknown) => void
  moduleId: string
  geolocation: GeoCoordinates | null
}

export const useFetchAlgolia = ({
  algoliaParameters,
  extraParameters,
  onSuccess,
  moduleId,
  onError,
  geolocation,
}: UseFetchAlgoliaInterface) => {
  const [hits, setHits] = useState<Hit<AlgoliaHit>[]>([])
  const [nbHits, setNbHits] = useState(0)
  const parsedParameters = parseAlgoliaParameters({
    geolocation,
    parameters: algoliaParameters,
  })

  const { data, error, isLoading, isError } = useQuery<SearchResponse<AlgoliaHit> | undefined>(
    ['algoliaModule', moduleId],
    async () => {
      if (!parsedParameters) return undefined
      return await fetchAlgolia<AlgoliaHit>({
        ...parsedParameters,
        ...extraParameters,
      } as FetchAlgoliaParameters)
    },
    {
      onSuccess: (algoliaData: SearchResponse<AlgoliaHit> | undefined) => {
        onSuccess && onSuccess(algoliaData)
        if (!algoliaData) return
        setHits(algoliaData.hits)
        setNbHits(algoliaData.nbHits)
      },
      onError,
      retry: false,
    }
  )
  return { data, error, isLoading, isError, hits, nbHits }
}
