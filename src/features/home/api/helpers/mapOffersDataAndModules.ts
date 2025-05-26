import { SearchResponse } from '@algolia/client-search'
import { flatten, uniqBy } from 'lodash'

import { ModuleData, OfferModuleParamsInfo } from 'features/home/types'
import { filterOfferHitWithImage } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOffer } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'

const isOfferModuleParamsInfo = (module: unknown): module is OfferModuleParamsInfo =>
  module !== undefined

const hasParams = (module: OfferModuleParamsInfo) => module.adaptedPlaylistParameters.length > 0

interface MapProps {
  data: SearchResponse<Offer>[]
  modulesParams: (OfferModuleParamsInfo | undefined)[]
  transformHits: (hit: AlgoliaOffer) => AlgoliaOffer
}

export const mapOffersDataAndModules = ({
  data,
  modulesParams,
  transformHits,
}: MapProps): ModuleData[] => {
  let moduleIterator = 0

  return modulesParams
    .filter(isOfferModuleParamsInfo)
    .filter(hasParams)
    .map((module) => {
      const nbParams = module.adaptedPlaylistParameters.length

      const moduleOffers = data.slice(moduleIterator, moduleIterator + nbParams)
      const hits = flatten(moduleOffers.map((hits) => hits.hits))
        .filter(filterOfferHitWithImage)
        .map(transformHits)

      const value: ModuleData = {
        playlistItems: uniqBy(hits, 'objectID') as Offer[],
        nbPlaylistResults: moduleOffers.reduce((prev, curr) => prev + curr.nbHits, 0),
        moduleId: module.moduleId,
      }

      moduleIterator += nbParams

      return value
    })
}
