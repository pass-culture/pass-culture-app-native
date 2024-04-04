import { HomepageModuleType } from 'features/home/types'
import { adaptVenueMapModule } from 'libs/contentful/adapters/modules/adaptVenueMapModule'
import { venueMapBlockContentModelFixture } from 'libs/contentful/fixtures/venueMapBlockContentModel.fixture'

describe('adaptVenueMapModule', () => {
  it('should adapt from Contentful VenueMapBlock data', () => {
    expect(adaptVenueMapModule(venueMapBlockContentModelFixture)).toEqual({
      type: HomepageModuleType.VenueMapModule,
    })
  })

  it('should return nothing when VenueMapBlock is unpublished', () => {
    const unpublishedVenueMap = {
      ...venueMapBlockContentModelFixture,
      fields: undefined,
    }

    expect(adaptVenueMapModule(unpublishedVenueMap)).toEqual(null)
  })
})
