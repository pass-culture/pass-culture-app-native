import { HomepageModuleType, VenueMapModule } from 'features/home/types'
import { VenueMapBlockContentModel } from 'libs/contentful/types'

export const adaptVenueMapModule = (module: VenueMapBlockContentModel): VenueMapModule | null => {
  if (module.fields === undefined) return null

  return {
    id: module.sys.id,
    type: HomepageModuleType.VenueMapModule,
  }
}
