import { OffersModule, OffersModuleParameters } from 'features/home/types'
import { adaptOffersModuleParameters } from 'libs/contentful/adapters/modules/helpers/adaptOffersModuleParameters'
import { AlgoliaParameters } from 'libs/contentful/types'

export const buildOffersParams = (
  firstParams: AlgoliaParameters,
  additionalParams: AlgoliaParameters[]
): OffersModule['offersModuleParameters'] =>
  [firstParams, ...additionalParams]
    .map(adaptOffersModuleParameters)
    .filter((m): m is OffersModuleParameters => m !== null)
