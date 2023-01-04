import isEmpty from 'lodash/isEmpty'

import { HomepageModuleType, VenuesModule } from 'features/home/types'
import { VenuesContentModel } from 'libs/contentful/types'

export const adaptVenuesModule = (modules: VenuesContentModel): VenuesModule | null => {
  const venuesParameters = modules.fields.venuesSearchParameters
    .filter((params) => params.fields && !isEmpty(params.fields))
    .map(({ fields }) => fields)

  if (venuesParameters.length === 0) return null
  return {
    type: HomepageModuleType.VenuesModule,
    id: modules.sys.id,
    venuesParameters: venuesParameters,
    displayParameters: modules.fields.displayParameters.fields,
  }
}
