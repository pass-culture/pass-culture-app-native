import { HomepageModuleType, VenueMapModule } from 'features/home/types'
import { VenueMapBlockContentModel } from 'libs/contentful/types'

import { ContentfulAdapter } from '../ContentfulAdapterFactory'

export const adaptVenueMapModule: ContentfulAdapter<VenueMapBlockContentModel, VenueMapModule> = (
  module
) => {
  if (module.fields === undefined) return null

  return {
    id: module.sys.id,
    type: HomepageModuleType.VenueMapModule,
  }
}
