import { SearchResponse } from '@algolia/client-search'
import { flatten, uniqBy } from 'lodash'
import { UseQueryResult } from 'react-query'

import { ModuleData, OfferModuleParamsInfo } from 'features/home/types'
import { AlgoliaHit } from 'libs/algolia'
import { filterOfferHit } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { Offer } from 'shared/offer/types'

const isOfferModuleParamsInfo = (module: unknown): module is OfferModuleParamsInfo =>
  module !== undefined

const hasParams = (module: OfferModuleParamsInfo) => module.nbParams > 0

interface MapProps {
  results: UseQueryResult<SearchResponse<Offer>[], unknown>
  modulesParams: (OfferModuleParamsInfo | undefined)[]
  transformHits: (hit: AlgoliaHit) => AlgoliaHit
}

export const mapOffersDataAndModules = ({ results, modulesParams, transformHits }: MapProps) => {
  const { data } = results

  if (data) {
    let moduleIterator = 0

    const offersModulesData: ModuleData[] = modulesParams
      .filter(isOfferModuleParamsInfo)
      .filter(hasParams)
      .map((module) => {
        const moduleOffers = data.slice(moduleIterator, moduleIterator + module.nbParams)
        const hits = flatten(moduleOffers.map((hits) => hits.hits))
          .filter(filterOfferHit)
          .map(transformHits)

        const value: ModuleData = {
          hits: uniqBy(hits, 'objectID') as Offer[],
          nbHits: moduleOffers.reduce((prev, curr) => prev + curr.nbHits, 0),
          moduleId: module.moduleId,
        }

        moduleIterator += module.nbParams

        return value
      })

    return offersModulesData
  }

  return [] as ModuleData[]
}
