import { AppV2VenuesModule, HomepageModuleType } from 'features/home/types'
import {
  AppV2VenuesContentModel,
  ProvidedVenuesParameters,
  VenuesParameters,
} from 'libs/contentful/types'

const venuesHaveFields = (parameters: VenuesParameters): parameters is ProvidedVenuesParameters =>
  !!parameters?.fields

export const adaptAppV2VenuesModule = (
  modules: AppV2VenuesContentModel
): AppV2VenuesModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (modules.fields === undefined) return null
  if (modules.fields.displayParameters.fields === undefined) return null

  const venuesParameters = modules.fields.venuesSearchParameters
    .filter(venuesHaveFields)
    .map(({ fields }) => fields)
  if (venuesParameters.length === 0) return null

  //   We doesn't want the subtitle for this venues module
  const { subtitle: _subtitle, ...displayParameters } = modules.fields.displayParameters.fields

  return {
    type: HomepageModuleType.AppV2VenuesModule,
    id: modules.sys.id,
    // @ts-expect-error: because of noUncheckedIndexedAccess
    venuesParameters: venuesParameters[0],
    displayParameters,
  }
}
