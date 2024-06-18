import { AppV2VenuesModule, HomepageModuleType } from 'features/home/types'
import {
  AppV2VenuesContentModel,
  ProvidedVenuesParameters,
  VenuesParameters,
} from 'libs/contentful/types'

import { ContentfulAdapter } from '../ContentfulAdapterFactory'

const venuesHaveFields = (parameters: VenuesParameters): parameters is ProvidedVenuesParameters =>
  !!parameters?.fields

export const adaptAppV2VenuesModule: ContentfulAdapter<
  AppV2VenuesContentModel,
  AppV2VenuesModule
> = (modules) => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (modules.fields === undefined) return null
  if (modules.fields.displayParameters.fields === undefined) return null

  const venuesParameters = modules.fields.venuesSearchParameters
    .filter(venuesHaveFields)
    .map(({ fields }) => fields)

  if (venuesParameters[0] === undefined) return null

  //   We doesn't want the subtitle for this venues module
  const { subtitle: _subtitle, ...displayParameters } = modules.fields.displayParameters.fields

  return {
    type: HomepageModuleType.AppV2VenuesModule,
    id: modules.sys.id,
    venuesParameters: venuesParameters[0],
    displayParameters,
    homeVenuesListEntryId: modules.fields.homeEntryId,
  }
}
