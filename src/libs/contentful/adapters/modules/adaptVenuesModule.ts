import { HomepageModuleType, VenuesModule } from 'features/home/types'
import {
  VenuesContentModel,
  VenuesParameters,
  ProvidedVenuesParameters,
} from 'libs/contentful/types'

const venuesHaveFields = (parameters: VenuesParameters): parameters is ProvidedVenuesParameters =>
  !!parameters?.fields

export const adaptVenuesModule = (modules: VenuesContentModel): VenuesModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (modules.fields === undefined) return null
  if (modules.fields.displayParameters.fields === undefined) return null

  const venuesParameters = modules.fields.venuesSearchParameters
    .filter(venuesHaveFields)
    .map(({ fields }) => fields)

  if (venuesParameters.length === 0) return null
  return {
    type: HomepageModuleType.VenuesModule,
    id: modules.sys.id,
    venuesParameters: venuesParameters[0],
    displayParameters: modules.fields.displayParameters.fields,
  }
}
