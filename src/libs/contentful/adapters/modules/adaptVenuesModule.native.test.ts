import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { adaptVenuesModule } from 'libs/contentful/adapters/modules/adaptVenuesModule'
import { venuesNatifModuleFixture } from 'libs/contentful/fixtures/venuesModule.fixture'
import { VenuesFields, isVenuesContentModel } from 'libs/contentful/types'

describe('adaptVenuesModule', () => {
  it('should adapt a venues module', () => {
    const rawVenuesModule = venuesNatifModuleFixture

    expect(isVenuesContentModel(rawVenuesModule)).toBeTruthy()
    expect(adaptVenuesModule(rawVenuesModule)).toEqual(formattedVenuesModule)
  })

  it('should return null when the module is not provided', () => {
    const rawVenuesModule = { ...venuesNatifModuleFixture, fields: undefined }

    expect(adaptVenuesModule(rawVenuesModule)).toEqual(null)
  })

  it('should return null when the Display Parameters module is not provided', () => {
    const rawVenuesModule = {
      ...venuesNatifModuleFixture,
      fields: {
        ...(venuesNatifModuleFixture.fields as VenuesFields),
        displayParameters: {
          ...(venuesNatifModuleFixture.fields as VenuesFields).displayParameters,
          fields: undefined,
        },
      },
    }

    expect(adaptVenuesModule(rawVenuesModule)).toEqual(null)
  })
})
