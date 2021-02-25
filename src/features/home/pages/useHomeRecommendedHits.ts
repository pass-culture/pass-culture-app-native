import { useQuery } from 'react-query'

import { humanizeId } from 'features/offer/services/dehumanizeId'
import { AlgoliaHit } from 'libs/algolia'
import { fetchAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { convertAlgoliaHitToCents } from 'libs/parsers/pricesConversion'

import { RecommendationPane } from '../contentful/moduleTypes'

const recommendedIds = [
  '145932',
  '145945',
  '145926',
  '145900',
  '145909',
  '145929',
  '145902',
  '145941',
  '145906',
  '145944',
]

export const useHomeRecommendedHits = (
  _recommendationModule: RecommendationPane | undefined
): AlgoliaHit[] => {
  // TODO (#6272) get the actual ids from the recommendation API
  const ids = recommendedIds
    .map((id: string) => humanizeId(+id))
    .filter((id) => typeof id === 'string') as string[]

  const { data } = useQuery(
    'recommendationHits',
    async () => await fetchAlgoliaHits<AlgoliaHit>(ids),
    { enabled: ids.length > 0 }
  )

  if (!data?.results) return [] as AlgoliaHit[]

  return (data?.results as AlgoliaHit[])
    .filter((hit) => hit && hit.offer && !!hit.offer.thumbUrl)
    .map(convertAlgoliaHitToCents)
}
