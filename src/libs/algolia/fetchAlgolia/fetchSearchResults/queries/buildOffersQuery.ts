import {
  BuildOffersQueryArgs,
  buildOffersQueryBase,
} from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildOffersQueryBase'

export const buildOffersQuery = (args: BuildOffersQueryArgs) => buildOffersQueryBase(args)
