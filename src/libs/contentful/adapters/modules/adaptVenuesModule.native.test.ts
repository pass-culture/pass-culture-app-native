import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { adaptVenuesModule } from 'libs/contentful/adapters/modules/adaptVenuesModule'
import { venuesNatifModuleFixture } from 'libs/contentful/fixtures/venuesModule.fixture'
import { isVenuesContentModel } from 'libs/contentful/types'

describe('adaptVenuesModule', () => {
  it('should adapt a venues module', () => {
    const rawVenuesModule = venuesNatifModuleFixture

    expect(isVenuesContentModel(rawVenuesModule)).toBeTruthy()
    expect(adaptVenuesModule(rawVenuesModule)).toEqual(formattedVenuesModule)
  })
})
