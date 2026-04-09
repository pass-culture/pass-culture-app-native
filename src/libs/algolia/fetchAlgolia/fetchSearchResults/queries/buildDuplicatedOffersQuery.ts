import {
  BuildOffersQueryArgs,
  buildOffersQueryBase,
} from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildOffersQueryBase'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'

export const buildDuplicatedOffersQuery = (args: BuildOffersQueryArgs) => ({
  ...buildOffersQueryBase(args),
  ...buildHitsPerPage(100),
  distinct: false,
  typoTolerance: false,
})
